import express from "express";
import multer from "multer";
import QRCode from "qrcode";
import path from "path";
import dotenv from "dotenv";
import scheduleFileDeletion from "../util/scheduleFileDeletion.js";
import { encryptFile, decryptFile } from "../util/encryption.js";

dotenv.config();    
const files = {};
const router = express.Router();

const storage = multer.diskStorage({
  destination: './upload/',
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


router.use(express.static('client'));

// Upload file and generate QR code
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  const fileMetadata = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    createdAt: new Date()
  };

  files[req.file.filename] = fileMetadata;

//   encryptFile(req.file.path);
  
  const fileUrl = `http://${req.headers.host}/download/${req.file.filename}`;
  const qrCodeUrl = await QRCode.toDataURL(fileUrl);
//   scheduleFileDeletion(req.file.path+'.enc');
  scheduleFileDeletion(req.file.path);
  res.json({ fileUrl, qrCodeUrl });
  console.log(fileUrl);
});




router.get("/download/:filename", (req, res) => {
  const file = files[req.params.filename];
  if (!file) {
    return res.status(404).send('File not found');
  }
  res.download(file.path);

});

export default router;