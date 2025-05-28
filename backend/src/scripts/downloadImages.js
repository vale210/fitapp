const fs = require('fs');
const path = require('path');
const https = require('https');

const imageUrls = {
  'press_banca.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
  'squat.jpg': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155',
  'pull_up.jpg': 'https://images.unsplash.com/photo-1598971639058-999901d5a461'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/ejercicios', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Imagen descargada: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Eliminar archivo incompleto
      console.error(`❌ Error descargando ${filename}:`, err.message);
      reject(err);
    });
  });
};

async function downloadAllImages() {
  console.log('🚀 Iniciando descarga de imágenes...');
  
  try {
    await Promise.all(
      Object.entries(imageUrls).map(([filename, url]) => 
        downloadImage(url, filename)
      )
    );
    console.log('✨ Todas las imágenes han sido descargadas exitosamente!');
  } catch (error) {
    console.error('❌ Error durante la descarga:', error);
  }
}

downloadAllImages(); 