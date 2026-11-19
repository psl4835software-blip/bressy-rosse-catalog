"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Maximize2, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const CART_STORAGE_KEY = "bressy-rosse-cart-v1";
const MAX_QUANTITY = 99;

export type StorefrontProduct = {
  id: string;
  name: string;
  brand: string;
  reference?: string;
  imageUrl?: string | null;
  unitPrice?: number;
};

type CartLine = { product: StorefrontProduct; quantity: number };
type ImagePreview = { src: string; alt: string; title: string };
type StorefrontActions = {
  addToCart: (product: StorefrontProduct) => void;
  openImage: (image: ImagePreview) => void;
};

const StorefrontContext = createContext<StorefrontActions | null>(null);

function isStoredCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;

  const line = value as Partial<CartLine>;
  const product = line.product;

  return Boolean(
    product &&
      typeof product.id === "string" &&
      product.id.length > 0 &&
      product.id.length <= 240 &&
      typeof product.name === "string" &&
      product.name.length <= 200 &&
      typeof product.brand === "string" &&
      product.brand.length <= 120 &&
      (product.reference === undefined || (typeof product.reference === "string" && product.reference.length <= 200)) &&
      (product.imageUrl === undefined || product.imageUrl === null || (typeof product.imageUrl === "string" && product.imageUrl.length <= 2048)) &&
      typeof line.quantity === "number" &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0 &&
      line.quantity <= MAX_QUANTITY &&
      (product.unitPrice === undefined || (typeof product.unitPrice === "number" && Number.isFinite(product.unitPrice) && product.unitPrice >= 0)),
  );
}

function formatBolivianos(amount: number) {
  return `Bs ${new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
}

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<ImagePreview | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  const cartDialogRef = useRef<HTMLDialogElement>(null);
  const hideStorefrontCart = pathname.startsWith("/admin");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) setCart(parsed.filter(isStoredCartLine));
    } catch {
      setCart([]);
    }

    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      setAnnouncement("No se pudo guardar el carrito en este dispositivo.");
    }
  }, [cart, cartReady]);

  useEffect(() => {
    const dialog = imageDialogRef.current;
    if (!dialog) return;

    if (activeImage && !dialog.open) dialog.showModal();
    if (!activeImage && dialog.open) dialog.close();
  }, [activeImage]);

  useEffect(() => {
    const dialog = cartDialogRef.current;
    if (!dialog) return;

    if (cartOpen && !hideStorefrontCart && !dialog.open) dialog.showModal();
    if ((!cartOpen || hideStorefrontCart) && dialog.open) dialog.close();
    if (hideStorefrontCart) setCartOpen(false);
  }, [cartOpen, hideStorefrontCart]);

  useEffect(() => {
    if (!activeImage && !cartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage, cartOpen]);

  const addToCart = useCallback((product: StorefrontProduct) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id
            ? { product, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) }
            : line,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
    setAnnouncement(`${product.name} se añadió al carrito.`);
  }, []);

  const openImage = useCallback((image: ImagePreview) => setActiveImage(image), []);
  const actions = useMemo(() => ({ addToCart, openImage }), [addToCart, openImage]);
  const itemCount = cart.reduce((total, line) => total + line.quantity, 0);
  const hasCompletePrices = cart.length > 0 && cart.every((line) => typeof line.product.unitPrice === "number");
  const subtotal = hasCompletePrices
    ? cart.reduce((total, line) => total + (line.product.unitPrice ?? 0) * line.quantity, 0)
    : null;
  const configuredNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const whatsappReady = /^\d{6,15}$/.test(configuredNumber);
  const message = [
    "Hola, quisiera consultar por estos productos:",
    ...cart.map(({ product, quantity }) => {
      const reference = product.reference ? ` · ${product.reference}` : "";
      const price = typeof product.unitPrice === "number" ? ` — ${formatBolivianos(product.unitPrice)} c/u` : "";
      return `• ${product.brand}: ${product.name}${reference} × ${quantity}${price}`;
    }),
    ...(subtotal === null ? [] : [`Subtotal de referencia: ${formatBolivianos(subtotal)}`]),
  ].join("\n");
  const whatsappHref = whatsappReady && cart.length
    ? `https://wa.me/${configuredNumber}?text=${encodeURIComponent(message)}`
    : undefined;

  const updateQuantity = (id: string, difference: number) => {
    setCart((current) =>
      current
        .map((line) => line.product.id === id
          ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.max(0, line.quantity + difference)) }
          : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeItem = (line: CartLine) => {
    setCart((current) => current.filter((item) => item.product.id !== line.product.id));
    setAnnouncement(`${line.product.name} se quitó del carrito.`);
  };

  return (
    <StorefrontContext.Provider value={actions}>
      {children}
      <p className="storefront-sr-only" role="status" aria-live="polite">{announcement}</p>

      {activeImage && (
        <dialog
          ref={imageDialogRef}
          className="storefront-image-dialog"
          aria-label="Imagen ampliada"
          onClose={() => setActiveImage(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          <div className="storefront-image-dialog__panel">
            <div className="storefront-image-dialog__heading">
              <p>{activeImage.title}</p>
              <button className="storefront-icon-button" type="button" aria-label="Cerrar imagen ampliada" onClick={() => imageDialogRef.current?.close()}>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="storefront-image-dialog__media">
              <Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" unoptimized />
            </div>
            <p className="storefront-image-dialog__hint">Pulsa Esc o toca fuera de la imagen para cerrar.</p>
          </div>
        </dialog>
      )}

      {!hideStorefrontCart && (
        <>
          <button id="storefront-cart-trigger" className="storefront-cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-controls="storefront-cart-dialog" aria-expanded={cartOpen} aria-label={`Abrir carrito, ${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}>
            <ShoppingBag size={19} strokeWidth={1.8} aria-hidden="true" />
            <span>Mi carrito</span>
            <span className="storefront-cart-trigger__count" aria-hidden="true">{itemCount}</span>
          </button>

          <dialog
            ref={cartDialogRef}
            id="storefront-cart-dialog"
            className="storefront-cart-dialog"
            aria-label="Carrito de compras"
            onClose={() => setCartOpen(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) event.currentTarget.close();
            }}
          >
            <section className="storefront-cart-panel">
              <header className="storefront-cart-panel__header">
                <div>
                  <p className="storefront-cart-panel__eyebrow">Tu selección</p>
                  <h2>Mi carrito <span>({itemCount})</span></h2>
                </div>
                <button className="storefront-icon-button" type="button" aria-label="Cerrar carrito" onClick={() => cartDialogRef.current?.close()}>
                  <X size={20} aria-hidden="true" />
                </button>
              </header>

              {cart.length ? (
                <>
                  <div className="storefront-cart-lines">
                    {cart.map((line) => (
                      <article className="storefront-cart-line" key={line.product.id}>
                        {line.product.imageUrl ? (
                          <div className="storefront-cart-line__image">
                            <Image src={line.product.imageUrl} alt="" fill sizes="76px" unoptimized />
                          </div>
                        ) : (
                          <div className="storefront-cart-line__image storefront-cart-line__image--empty"><ShoppingBag size={18} aria-hidden="true" /></div>
                        )}
                        <div className="storefront-cart-line__body">
                          <p className="storefront-cart-line__brand">{line.product.brand}</p>
                          <h3>{line.product.name}</h3>
                          {line.product.reference && <p className="storefront-cart-line__reference">{line.product.reference}</p>}
                          {typeof line.product.unitPrice === "number" && <p className="storefront-cart-line__price">{formatBolivianos(line.product.unitPrice)} c/u</p>}
                          <div className="storefront-cart-line__controls">
                            <div className="storefront-quantity" aria-label={`Cantidad: ${line.quantity}`}>
                              <button type="button" aria-label={`Reducir cantidad de ${line.product.name}`} disabled={line.quantity <= 1} onClick={() => updateQuantity(line.product.id, -1)}>
                                <Minus size={14} aria-hidden="true" />
                              </button>
                              <span aria-live="polite">{line.quantity}</span>
                              <button type="button" aria-label={`Aumentar cantidad de ${line.product.name}`} disabled={line.quantity >= MAX_QUANTITY} onClick={() => updateQuantity(line.product.id, 1)}>
                                <Plus size={14} aria-hidden="true" />
                              </button>
                            </div>
                            <button className="storefront-remove-button" type="button" onClick={() => removeItem(line)}>
                              <Trash2 size={14} aria-hidden="true" /> Quitar
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <footer className="storefront-cart-panel__footer">
                    {subtotal !== null ? (
                      <>
                        <div className="storefront-cart-subtotal">
                          <span>Subtotal referencial</span>
                          <strong>{formatBolivianos(subtotal)}</strong>
                        </div>
                        <p className="storefront-cart-note">Importes según el catálogo. Confirma precio y disponibilidad al enviar tu consulta.</p>
                      </>
                    ) : (
                      <p className="storefront-cart-note">Algunos artículos no muestran precio. La tienda confirmará esos detalles por WhatsApp.</p>
                    )}
                    {whatsappHref ? (
                      <a className="storefront-whatsapp-button" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                        <MessageCircle size={18} aria-hidden="true" /> Enviar pedido por WhatsApp
                      </a>
                    ) : (
                      <button className="storefront-whatsapp-button" type="button" disabled>
                        <MessageCircle size={18} aria-hidden="true" /> WhatsApp aún no está configurado
                      </button>
                    )}
                    {!whatsappReady && <p className="storefront-cart-note">El carrito ya guarda tu selección. El envío se activará cuando configuremos el número de pedidos.</p>}
                  </footer>
                </>
              ) : (
                <div className="storefront-cart-empty">
                  <span><ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" /></span>
                  <h3>Tu carrito está vacío</h3>
                  <p>Agrega productos del catálogo para preparar tu pedido.</p>
                  <button className="storefront-cart-empty__button" type="button" onClick={() => cartDialogRef.current?.close()}>Seguir explorando</button>
                </div>
              )}
            </section>
          </dialog>
        </>
      )}
    </StorefrontContext.Provider>
  );
}

function useStorefrontActions() {
  const actions = useContext(StorefrontContext);
  if (!actions) throw new Error("Storefront interactions must be used inside StorefrontProvider.");
  return actions;
}

export function ImageLightboxButton({
  src,
  alt,
  title,
  width = 1200,
  height = 1200,
  sizes = "(max-width: 680px) 50vw, 33vw",
  fill = false,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
  sizes?: string;
  fill?: boolean;
  className: string;
  imageClassName?: string;
}) {
  const { openImage } = useStorefrontActions();
  const imageSizing = fill ? { fill: true as const } : { width, height };

  return (
    <button className={className} type="button" onClick={() => openImage({ src, alt, title })} aria-haspopup="dialog" aria-label={`Ampliar imagen: ${title}`}>
      <Image src={src} alt={alt} sizes={sizes} unoptimized className={imageClassName} {...imageSizing} />
      <span className="storefront-image-zoom" aria-hidden="true"><Maximize2 size={15} /></span>
    </button>
  );
}

export function AddToCartButton({ product, label = "Añadir al carrito" }: { product: StorefrontProduct; label?: string }) {
  const { addToCart } = useStorefrontActions();

  return (
    <button className="storefront-add-button" type="button" onClick={() => addToCart(product)} aria-label={`Añadir ${product.name} al carrito`}>
      <ShoppingBag size={16} strokeWidth={1.8} aria-hidden="true" />
      {label}
    </button>
  );
}
