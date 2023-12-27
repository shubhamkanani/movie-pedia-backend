import CryptoJS from "crypto-js";
import _ from "lodash";
import dotenv from "dotenv";
dotenv.config();

const encryptDecrypt = async (req, res, next) => {
  const encryptionKey = process.env.SECRET_KEY;

  // Decrypt the request body if it exists
  if (process.env.MODE === "Production" && !_.isEmpty(req.body)) {
    const payload = req.body.payload;
    const decryptedBody = CryptoJS.AES.decrypt(payload, encryptionKey).toString(
      CryptoJS.enc.Utf8
    );
    req.body = JSON.parse(decryptedBody);
  }

  // Store a reference to the original send function
  const originalSend = res.send;

  // Replace the send function with our own implementation
  res.send = function (body) {
    if (process.env.MODE === "Production") {
      // Encrypt the response body
      const encryptedBody = CryptoJS.AES.encrypt(
        JSON.stringify(body),
        encryptionKey
      ).toString();

      // Call the original send function with the encrypted body
      originalSend.call(res, encryptedBody);
    } else {
      originalSend.call(res, body);
    }
  };

  // Call the next middleware in the chain
  next();
};

export default encryptDecrypt;
