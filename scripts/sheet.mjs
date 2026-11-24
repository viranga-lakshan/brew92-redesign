import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const [dir, out, ...names] = process.argv.slice(2);
const T = 300, cols = 4, rows = Math.ceil(names.length / cols);
const comps = [];
for (let i = 0; i < names.length; i++) {
  const b = await sharp(path.join(dir, names[i])).resize(T, T, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer();
  comps.push({ input: b, left: (i % cols) * T, top: Math.floor(i / cols) * T });
}
await sharp({ create: { width: T * cols, height: T * rows, channels: 3, background: '#fff' } }).composite(comps).jpeg({ quality: 70 }).toFile(out);
console.log(names.map((n, i) => `${i}:${n}`).join('\n'));
