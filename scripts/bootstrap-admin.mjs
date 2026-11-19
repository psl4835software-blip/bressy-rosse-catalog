import process from "node:process";

function ask(prompt, { hidden = false } = {}) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Ejecuta este comando desde una terminal interactiva para ocultar la contraseña y el token.");
  }

  process.stdout.write(prompt);
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const finish = (callback, value) => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      process.stdout.write("\n");
      callback(value);
    };
    const onData = (chunk) => {
      for (const character of String(chunk)) {
        if (character === "\u0003") {
          finish(reject, new Error("Operación cancelada."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish(resolve, answer);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          if (answer.length > 0) {
            answer = Array.from(answer).slice(0, -1).join("");
            process.stdout.write("\b \b");
          }
          continue;
        }
        if (character < " " || character === "\u001b") continue;
        answer += character;
        process.stdout.write(hidden ? "•" : character);
      }
    };
    let answer = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

try {
  const originInput = process.argv[2] || await ask("URL del sitio (ej. https://catalogo.example.com): ");
  const origin = new URL(originInput.trim());
  if (origin.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(origin.hostname)) {
    throw new Error("Usa HTTPS para crear la cuenta en un sitio publicado.");
  }
  const minimumPasswordLength = ["localhost", "127.0.0.1"].includes(origin.hostname) ? 3 : 12;
  const baseUrl = origin.origin.replace(/\/$/, "");
  const username = (await ask("Usuario: ")).trim().toLowerCase();
  const name = (await ask("Nombre visible: ")).trim();
  const password = await ask(`Contraseña (mínimo ${minimumPasswordLength} caracteres): `, { hidden: true });
  const confirmation = await ask("Repite la contraseña: ", { hidden: true });
  const token = await ask("Token inicial (entrada oculta): ", { hidden: true });

  if (!/^[a-z0-9._-]{3,30}$/.test(username)) throw new Error("El usuario debe tener de 3 a 30 caracteres: letras, números, punto, guion o guion bajo.");
  if (name.length < 2 || name.length > 80) throw new Error("El nombre visible debe tener entre 2 y 80 caracteres.");
  if (password.length < minimumPasswordLength || password.length > 128) {
    throw new Error(`La contraseña debe tener entre ${minimumPasswordLength} y 128 caracteres.`);
  }
  if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");
  if (token.length < 32) throw new Error("El token inicial debe tener al menos 32 caracteres.");

  const response = await fetch(`${baseUrl}/api/admin/bootstrap`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ username, name, password }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `No se pudo crear la cuenta (HTTP ${response.status}).`);
  console.log(`Cuenta ${username} creada. Quita BOOTSTRAP_ADMIN_TOKEN de Cloudflare antes de habilitar el sitio públicamente.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "No se pudo crear la cuenta inicial.");
  process.exitCode = 1;
} finally {
  if (process.stdin.isTTY && typeof process.stdin.setRawMode === "function") process.stdin.setRawMode(false);
  process.stdin.pause();
}
