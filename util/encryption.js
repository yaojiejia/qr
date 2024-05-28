import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import path from "path";
dotenv.config();

const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');;
const IV_LENGTH = 16

export const encryptFile = (filePath) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(filePath + '.enc');
  
    input.pipe(cipher).pipe(output);
    output.on('finish', () => {
      fs.unlinkSync(filePath); // Delete original file
    });
  };

export const decryptFile = (filePath, res) => {
    const iv = Buffer.alloc(IV_LENGTH, 0); // Initialization vector.
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(filePath.replace('.enc', ''));
  
    input.pipe(decipher).pipe(output);
    output.on('finish', () => {
      res.download(filePath.replace('.enc', ''), () => {
        fs.unlinkSync(filePath.replace('.enc', '')); // Delete decrypted file after download
      });
    });
  };
