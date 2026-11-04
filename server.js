require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const CODE = String(process.env.CODE || '').trim();
const NAME = process.env.NAME || '';
const content = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));

// the code is only ever checked here on the server, it is never inside the public files
const unlocked = new Set();
const cookieName = 'unlocked';
const getCookie = (req) => (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='));

app.post('/api/verify', (req, res) => {
  const ok = String(req.body.code || '') === CODE;
  if (ok) res.setHeader('Set-Cookie', `${cookieName}=1; Path=/; SameSite=Lax; HttpOnly`);
  res.json({ ok });
});

app.get('/api/content', (req, res) => {
  if (!getCookie(req)) return res.status(401).json({ error: 'locked' });
  const c = content();
  res.json({ name: NAME, photos: c.photos, letter: c.letter });
});
app.get('/api/hint', (req, res) => res.json({ hint: content().hint }));

// emails the code to whatever address the person types in
const sent = new Map(); // simple rate limit per email
app.post('/api/send-code', async (req, res) => {
  const email = String(req.body.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });
  const last = sent.get(email) || 0;
  if (Date.now() - last < 30000) return res.status(429).json({ ok: false, error: 'Please wait a bit before asking again' });
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Surprise'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your secret code 💜',
      text: `Your code is: ${CODE}`,
      html: `<div style="font-family:Arial;text-align:center;padding:24px"><h2>Your secret code</h2><p style="font-size:40px;letter-spacing:10px;font-weight:bold">${CODE}</p></div>`
    });
    sent.set(email, Date.now());
    res.json({ ok: true });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ ok: false, error: 'Could not send the email' });
  }
});

// pages after the lock need the unlock cookie
['surprise', 'pictures', 'flowers', 'mail', 'letter', 'cake'].forEach(p => {
  app.get('/' + p, (req, res) => {
    if (!getCookie(req)) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'pages', p + '.html'));
  });
});
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html', extensions: [] }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Running on http://localhost:' + port));
