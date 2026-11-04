# Surprise website

Flow: Enter Code -> SURPRISE (4 Kuromi gifts) -> Pictures / Flowers / Mail -> Letter / Cake

## 1. Put your stuff in (all the changes live here)
- `.env` (copy `.env.example` to `.env`): the 4-digit CODE, the NAME on the letter, and YOUR email + app password that sends the code.
- `content.json`: the hint text, your photo captions, and the paragraph for the letter.
- `public/assets/photos/`: your photos, named as in content.json (photo1.jpg ...). Add more by adding lines in content.json.
- `public/assets/kuromi/`: your Kuromi images (PNG, transparent background), exact names:
  kuromi-sad.png, kuromi-happy.png, kuromi-photos.png, kuromi-flowers.png, kuromi-letter.png,
  kuromi-cake.png, kuromi-photo-a.png, kuromi-photo-b.png, kuromi-blow.png
  (until you add them, a dashed placeholder shows the file name)

## 2. Run locally
    npm install
    npm start
Open http://localhost:3000

## 3. Host it
Upload the whole folder (NOT node_modules) to any Node host (Render, Railway, a VPS...).
Build command: `npm install`, start command: `npm start`.
Set the same values from .env as the host's Environment Variables (CODE, NAME, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_NAME).
Gmail: use an App Password (needs 2-step verification), not your normal password.
