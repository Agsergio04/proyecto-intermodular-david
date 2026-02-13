const fs = require('fs');
const path = require('path');

// Usando canvas nativo de Node.js para generar la imagen
const { createCanvas } = require('canvas');

// Dimensiones estándar para Open Graph: 1200x630
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fondo con gradiente
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Agregar formas decorativas
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
ctx.beginPath();
ctx.arc(100, 100, 150, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.arc(1100, 550, 200, 0, Math.PI * 2);
ctx.fill();

// Título principal
ctx.font = 'bold 80px Arial, sans-serif';
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('PreguntaT', width / 2, height / 2 - 100);

// Subtítulo
ctx.font = '40px Arial, sans-serif';
ctx.fillStyle = '#FFFFFF';
ctx.fillText('Learn & Master Code', width / 2, height / 2 - 20);

// Call-to-action con fondo
const ctaY = height / 2 + 80;
const ctaWidth = 400;
const ctaHeight = 70;
const ctaX = (width - ctaWidth) / 2;

// Función para dibujar rectángulo redondeado
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Fondo del botón
ctx.fillStyle = '#FFFFFF';
roundRect(ctaX, ctaY, ctaWidth, ctaHeight, 15);
ctx.fill();

// Texto del CTA
ctx.font = 'bold 32px Arial, sans-serif';
ctx.fillStyle = '#667eea';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Start Practicing Now', width / 2, ctaY + ctaHeight / 2);

// Logo pequeño en la esquina superior
ctx.font = '20px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
ctx.textAlign = 'left';
ctx.fillText('AI-Powered Learning Platform', 40, 50);

// Guardar la imagen
const outputPath = path.join(__dirname, 'frontend', 'public', 'og-image.png');
const stream = fs.createWriteStream(outputPath);

canvas.createPNGStream().pipe(stream);

stream.on('finish', () => {
  console.log(`✅ Imagen OG generada correctamente en: ${outputPath}`);
  console.log('Dimensiones: 1200x630px');
  console.log('Incluye: Título, Subtítulo, Call-to-Action visible');
});

stream.on('error', (err) => {
  console.error('❌ Error al generar la imagen:', err);
});
