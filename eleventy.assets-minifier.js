import { globSync } from "glob";
import fs from "fs/promises";
import path from "path";

import CleanCSS from "clean-css";
import * as terser from "terser";
import sharp from "sharp";

async function updateHtmlReferences(publicDir, originalName, newName) {
  const htmlFiles = globSync(`${publicDir}/**/*.{html,css}`);
  
  for (const file of htmlFiles) {
    let content = await fs.readFile(file, "utf-8");
    const updated = content.replace(new RegExp(originalName, "g"), newName);
    console.log(`Updating html assets references (${file}): ${originalName} -> ${newName} ...`);
    await fs.writeFile(file, updated);
  }
}

export async function updateImages(hash) {
  const imageDir = "public/assets/images/";
  const htmlDir = "public/";

  const imageFiles = globSync(`${imageDir}**/*.{png,jpg,jpeg,webp,svg,gif}`);

  for (const filePath of imageFiles) {
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const hashedName = `${base}-${hash}${ext}`;
    const newFilePath = path.join(path.dirname(filePath), hashedName);

    await compressImage(filePath);
    await fs.rename(filePath, newFilePath);
    await updateHtmlReferences(htmlDir, path.basename(filePath), hashedName);
  }
}

async function compressImage(filePath) {
  const stats = await fs.stat(filePath);

  if (stats.size > 500 * 1024) {
    const ext = path.extname(filePath).toLowerCase();
    const buffer = await fs.readFile(filePath);
    const image = sharp(buffer);

    const size = (stats.size / 1024).toFixed(1);
    console.log(`🔧 Compressing (quality 80%) ${filePath} (${size} KB)...`);

    let newBuffer;
    try {
      if (ext === ".jpg" || ext === ".jpeg") {
        newBuffer = await image.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      } else if (ext === ".png") {
        newBuffer = await image.png({ quality: 80, compressionLevel: 9 }).toBuffer();
      } else if (ext === ".webp") {
        newBuffer = await image.webp({ quality: 80 }).toBuffer();
      }

      await fs.writeFile(filePath, newBuffer);

      let { size: newSize } = await fs.stat(filePath);
      newSize = (newSize / 1024).toFixed(1);

      console.log(`✅ ${filePath} reduced to new size ${newSize} KB (${((1 - (newSize / size)) * 100).toFixed(2)}% reduction)`);
    } catch (error) {
      console.error(`❌ Failed to compress image ${filePath}`, error);
    }
  }
};

export async function minifyCSS(hash) {
  const inputFile = 'src/assets/css/index.css';
  const input = await fs.readFile(inputFile, 'utf8');
  const output = new CleanCSS().minify(input);

  const newFilename = `main-${hash}.css`;
  console.log(`Minifying CSS to public/assets/css/${newFilename} ...`);

  await fs.mkdir('public/assets/css', { recursive: true });
  await fs.writeFile(`public/assets/css/${newFilename}`, output.styles);
  await updateHtmlReferences("public", "index.css", newFilename);
}

export async function minifyJS(hash) {
  const inputFile = 'src/assets/js/countdown.js';
  const input = await fs.readFile(inputFile, 'utf8');
  const output = await terser.minify(input);

  const newFilename = `countdown-${hash}.js`;
  console.log(`Minifying JS to public/assets/js/${newFilename} ...`);

  await fs.mkdir('public/assets/js', { recursive: true });
  await fs.writeFile(`public/assets/js/${newFilename}`, output.code);
  await updateHtmlReferences("public", "countdown.js", newFilename);
}
