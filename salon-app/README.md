# Mi Salón — despliegue en tu propio dominio

App completa: frontend + API (Node.js/Express) + base de datos PostgreSQL.
Guía pensada para hacerlo gratis o casi gratis (solo pagas el dominio).

Piezas que vas a usar:
- **Neon** → base de datos PostgreSQL gratis
- **Render** → aloja tu API + frontend gratis
- **Porkbun** → compra el dominio (barato, sin trucos raros de precio)
- **GitHub** → para que Render pueda desplegar tu código

---

## 1. Sube el proyecto a GitHub

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Crea un repositorio nuevo (por ejemplo `mi-salon`), público o privado, sin plantilla.
3. Sube esta carpeta completa (todo lo que ves aquí, menos `node_modules` si lo llegas a crear).
   - Más fácil: desde la web de GitHub, "Add file" → "Upload files", arrastra todos los archivos.

## 2. Crea la base de datos (Neon)

1. Entra a [neon.tech](https://neon.tech) y crea una cuenta gratis (no pide tarjeta).
2. Crea un proyecto nuevo. Te da automáticamente una base de datos.
3. En el panel, busca el **Connection string** (algo como
   `postgresql://usuario:contraseña@host.neon.tech/basededatos?sslmode=require`) y cópialo.
4. Abre el **SQL Editor** de Neon, pega el contenido del archivo `schema.sql` de este proyecto, y ejecútalo.
   Esto crea las tablas (clientas, servicios, citas, inventario, finanzas).

## 3. Despliega la API + frontend (Render)

1. Entra a [render.com](https://render.com) y crea una cuenta gratis (puedes entrar con GitHub).
2. Click en **New +** → **Web Service**.
3. Conecta tu repositorio de GitHub (`mi-salon`).
4. Configura:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Instance type**: Free
5. En la sección **Environment Variables**, añade:
   - `DATABASE_URL` → pega el connection string de Neon del paso 2.
   - `SALON_USERNAME` → el usuario con el que va a entrar (ej. `laura`).
   - `SALON_PASSWORD_HASH` → ver el paso 5.1 justo abajo.
   - `SESSION_SECRET` → cualquier frase larga y aleatoria que solo tú conozcas (ej. `correr-por-la-playa-93x`).
   - `NODE_ENV` → `production`

   ### 5.1 Genera el hash de la contraseña
   No guardes la contraseña "en texto plano" en ningún sitio — genera su hash una vez, en tu computadora:
   ```bash
   npm install
   node scripts/hash-password.js "la-contraseña-que-quieras"
   ```
   Te imprime algo como `$2a$10$...` — copia exactamente eso como valor de `SALON_PASSWORD_HASH` en Render.
   La contraseña real solo la sabes tú (y quien se la digas); en el servidor solo queda el hash.

6. Click en **Create Web Service**. Render instala todo y arranca la app.
7. Cuando termine, te da una URL tipo `https://mi-salon.onrender.com` — ábrela, te llevará directo a la
   pantalla de inicio de sesión.

> Nota: en el plan gratis, Render "duerme" la app si nadie la usa un rato, y tarda unos 30-50 segundos
> en despertar la primera vez que alguien entra después de estar dormida. Es normal, no es un error.
> Además, al dormirse la sesión se pierde, así que puede pedir iniciar sesión de nuevo tras un rato sin usarla.

## 4. Compra el dominio (Porkbun)

1. Entra a [porkbun.com](https://porkbun.com) y busca el nombre que quieras
   (algo como `misalon.com`, `unasbytiname.com`, lo que prefieras — desde ~7-12 €/año según la extensión;
   `.online`, `.shop` o `.site` suelen ser aún más baratos el primer año).
2. Cómpralo (tarjeta o PayPal). No hace falta ningún extra que te ofrezcan (email, protección de privacidad
   ya viene incluida gratis en Porkbun).

## 5. Conecta el dominio con Render

1. En Render, entra a tu Web Service → pestaña **Settings** → **Custom Domains** → **Add Custom Domain**.
2. Escribe tu dominio (por ejemplo `misalon.com` y/o `www.misalon.com`). Render te muestra un registro DNS
   que tienes que crear (normalmente un `CNAME` para `www` y un registro `A`/`ALIAS` para el dominio raíz).
3. Ve a Porkbun → tu dominio → **DNS Records**, y añade exactamente lo que Render te indicó.
4. Espera entre unos minutos y unas horas (propagación DNS). Render detecta el dominio automáticamente
   y te genera el certificado HTTPS gratis — no tienes que hacer nada más.

Cuando esté listo, tu novia entra directamente a `https://misalon.com` (o el dominio que elijas) y ahí
está su app, con todo guardado de verdad en la base de datos.

---

## Desarrollo local (opcional)

Si quieres probarlo en tu computadora antes de desplegar:

```bash
npm install
cp .env.example .env
# edita .env y pon tu DATABASE_URL de Neon
npm start
```

Abre `http://localhost:3000`.

## Estructura del proyecto

```
server.js          → API (Express) + login + sirve el frontend
schema.sql          → estructura de la base de datos
public/index.html   → la app (frontend)
public/login.html   → pantalla de inicio de sesión
scripts/hash-password.js → genera el hash de tu contraseña
.env.example         → variables de entorno necesarias
```

## Si algo falla

- **La app no arranca en Render**: revisa los "Logs" en el panel de Render — casi siempre es
  `DATABASE_URL` mal copiado.
- **Se ve la página pero no carga nada**: abre las herramientas de desarrollador del navegador (F12) →
  pestaña "Network", y mira si las llamadas a `/api/...` devuelven error.
- **El dominio no conecta**: los cambios de DNS a veces tardan hasta 24h, aunque casi siempre son minutos.
