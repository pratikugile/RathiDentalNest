const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = path.resolve(__dirname, '..', 'src', 'assets', 'logoRathi-light.jpeg');
const outRoot = path.resolve(__dirname, '..', 'assets', 'generated-icons');

const android = {
  'mipmap-ldpi': 36,
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
  'playstore': 512,
};

const ios = {
  'Icon-App-1024': 1024,
  'Icon-App-60@3x': 180,
  'Icon-App-60@2x': 120,
  'Icon-App-83.5@2x': 167,
  'Icon-App-76@2x': 152,
  'Icon-App-76': 76,
  'Icon-App-40@3x': 120,
  'Icon-App-40@2x': 80,
  'Icon-App-29@3x': 87,
  'Icon-App-29@2x': 58,
  'Icon-App-20@3x': 60,
  'Icon-App-20@2x': 40,
  'Icon-App-29': 29,
};

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function genAndroid() {
  const androidOut = path.join(outRoot, 'android');
  await ensureDir(androidOut);
  for (const [key, size] of Object.entries(android)) {
    const dir = path.join(androidOut, key);
    await ensureDir(dir);
    const outFile = path.join(dir, key === 'playstore' ? 'playstore-icon.png' : 'ic_launcher.png');
    await sharp(src)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outFile);
    console.log('Wrote', outFile);
  }
}

async function genIos() {
  const iosOut = path.join(outRoot, 'ios');
  await ensureDir(iosOut);
  for (const [name, size] of Object.entries(ios)) {
    const outFile = path.join(iosOut, `${name}.png`);
    await sharp(src)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outFile);
    console.log('Wrote', outFile);
  }
}

async function run() {
  try {
    if (!fs.existsSync(src)) {
      console.error('Source image not found:', src);
      process.exit(1);
    }
    await genAndroid();
    await genIos();
    console.log('All icons generated in', outRoot);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
