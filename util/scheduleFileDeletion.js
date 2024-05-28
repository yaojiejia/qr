import fs from "fs";

const scheduleFileDeletion = (filePath) => {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }, 120000);
};

export default scheduleFileDeletion;