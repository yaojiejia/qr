document.addEventListener('DOMContentLoaded', function () {
    const chooseFileBtn = document.getElementById('chooseFileBtn');
    const fileInput = document.getElementById('fileID');
    const qrCodeContainer = document.getElementById('qrCode');
  
    chooseFileBtn.addEventListener('click', () => {
      fileInput.click();
    });
  
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData
        });
  
        const data = await response.json();
        const qrCodeImg = document.createElement('img');
        qrCodeImg.src = data.qrCodeUrl;
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.appendChild(qrCodeImg);
      }
    });
  });
  