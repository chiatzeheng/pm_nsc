// Import the 'crypto' module
import crypto from "crypto";
const secret_key = crypto
  .createHash("sha256")
  .update(String(process.env.NEXT_PUBLIC_ENCRYPT_KEY))
  .digest("base64")
  .substr(0, 32);

export function encryptStringWithKey(string: string) {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create a cipher object with AES-256-CBC algorithm
  const cipher = crypto.createCipheriv("aes-256-cbc", secret_key, iv);

  // Encrypt the string
  let encrypted = cipher.update(string, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combine the IV and the encrypted data
  const result = iv.toString("hex") + encrypted;

  return result;
}

// export function decryptStringWithKey(encryptedString: string) {
//   // Extract the IV and the encrypted data from the encrypted string
//   const iv = Buffer.from(encryptedString.slice(0, 32), "hex");
//   const encryptedData = encryptedString.slice(32);

//   // Create a decipher object with AES-256-CBC algorithm
//   const decipher = crypto.createDecipheriv("aes-256-cbc", secret_key, iv);

//   // Decrypt the data
//   let decrypted = decipher.update(encryptedData, "hex", "utf8");
//   decrypted += decipher.final("utf8");

//   return decrypted;
// }
