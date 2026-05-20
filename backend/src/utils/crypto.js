const crypto = require("crypto");

// ⚠️ cambia esto por algo tuyo
const SECRET_KEY = "mi_clave_super_secreta_123";

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    crypto.scryptSync(SECRET_KEY, "salt", 32),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final()
  ]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(hash) {
  const [ivHex, contentHex] = hash.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(contentHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    crypto.scryptSync(SECRET_KEY, "salt", 32),
    iv
  );

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final()
  ]);

  return decrypted.toString();
}

module.exports = { encrypt, decrypt };