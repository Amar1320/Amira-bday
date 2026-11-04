// Kuromi stickers: put your own images in public/assets/kuromi/ using these exact file names.
const STICKERS = {
  sad: 'kuromi-sad.png',          // "Wrong Passcode" popup
  happy: 'kuromi-happy.png',      // "Welcome / correct" popup
  photos: 'kuromi-photos.png',    // gift 1 (pictures)
  flowers: 'kuromi-flowers.png',  // gift 2 (flowers)
  letter: 'kuromi-letter.png',    // gift 3 (letter)
  cake: 'kuromi-cake.png',        // gift 4 (cake)
  photoA: 'kuromi-photo-a.png',   // small sticker on the pictures page
  photoB: 'kuromi-photo-b.png',   // small sticker on the pictures page
  blow: 'kuromi-blow.png'         // under the cake
};
function sticker(key, cls) {
  const img = new Image();
  img.className = 'sticker ' + (cls || '');
  img.alt = 'Kuromi';
  const file = STICKERS[key];
  img.src = '/assets/kuromi/' + file;
  img.onerror = () => {
    img.onerror = null;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='180'><rect x='4' y='4' width='192' height='172' rx='18' fill='#fff' fill-opacity='.6' stroke='#b3163f' stroke-width='3' stroke-dasharray='8 6'/><text x='100' y='80' font-family='Arial' font-size='16' font-weight='bold' fill='#b3163f' text-anchor='middle'>Kuromi image</text><text x='100' y='104' font-family='Arial' font-size='12' fill='#7a0f2c' text-anchor='middle'>${file}</text></svg>`;
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  };
  return img;
}
function fillStickers() {
  document.querySelectorAll('[data-sticker]').forEach(el => el.replaceWith(sticker(el.dataset.sticker, el.dataset.cls)));
}
document.addEventListener('DOMContentLoaded', fillStickers);
