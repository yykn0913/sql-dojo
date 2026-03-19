// アイコンPNGを生成するスクリプト
import { createWriteStream } from 'fs';
import { deflateSync } from 'zlib';

// CRC32 実装（依存なし）
function crc32(buf) {
  let crc = -1;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeB = Buffer.from(type, 'ascii');
  const combined = Buffer.concat([typeB, data]);
  const crcVal = crc32(combined);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcB = Buffer.alloc(4); crcB.writeUInt32BE(crcVal);
  return Buffer.concat([len, typeB, data, crcB]);
}

function createIconPNG(size) {
  // SQL道場のアイコン: ダークネイビー背景 + アクセントブルー
  const bg = { r: 15, g: 17, b: 23 };   // #0f1117
  const ac = { r: 99, g: 179, b: 237 };  // #63b3ed

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  // ピクセルデータ: 角丸風に背景色 + 中央に「S」の形をアクセントカラーで描く
  const raw = Buffer.alloc(size * (size * 3 + 1));
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;  // 円の半径

  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const idx = y * (size * 3 + 1) + 1 + x * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 角丸四角形の内側かどうか判定
      const cornerR = size * 0.2;
      const inRoundRect =
        (x >= cornerR && x <= size - cornerR) ||
        (y >= cornerR && y <= size - cornerR) ||
        (Math.sqrt(Math.pow(x - cornerR, 2) + Math.pow(y - cornerR, 2)) <= cornerR) ||
        (Math.sqrt(Math.pow(x - (size - cornerR), 2) + Math.pow(y - cornerR, 2)) <= cornerR) ||
        (Math.sqrt(Math.pow(x - cornerR, 2) + Math.pow(y - (size - cornerR), 2)) <= cornerR) ||
        (Math.sqrt(Math.pow(x - (size - cornerR), 2) + Math.pow(y - (size - cornerR), 2)) <= cornerR);

      if (!inRoundRect) {
        raw[idx] = 0; raw[idx + 1] = 0; raw[idx + 2] = 0;
        continue;
      }

      // 「DB」のような横棒2本（シンプルなデザイン）
      const relX = (x - size * 0.2) / (size * 0.6); // 0〜1
      const relY = (y - size * 0.2) / (size * 0.6); // 0〜1
      const barHeight = 0.1;
      const isBar1 = relY >= 0.25 && relY <= 0.25 + barHeight && relX >= 0 && relX <= 1;
      const isBar2 = relY >= 0.45 && relY <= 0.45 + barHeight && relX >= 0 && relX <= 0.7;
      const isBar3 = relY >= 0.65 && relY <= 0.65 + barHeight && relX >= 0 && relX <= 1;

      if (isBar1 || isBar2 || isBar3) {
        raw[idx] = ac.r; raw[idx + 1] = ac.g; raw[idx + 2] = ac.b;
      } else {
        raw[idx] = bg.r; raw[idx + 1] = bg.g; raw[idx + 2] = bg.b;
      }
    }
  }

  const idat = deflateSync(raw);

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

import { writeFileSync } from 'fs';

for (const size of [192, 512, 180]) {
  const png = createIconPNG(size);
  writeFileSync(`public/icon-${size}.png`, png);
  console.log(`✅ icon-${size}.png created`);
}
