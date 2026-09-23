// Genera el hash de tu contraseña para pegarlo en SALON_PASSWORD_HASH.
// Uso: node scripts/hash-password.js "tu-contraseña"
const bcrypt = require('bcryptjs');
const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/hash-password.js "tu-contraseña"');
  process.exit(1);
}
console.log(bcrypt.hashSync(password, 10));
