const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPNG(width, height, pixelFn) {
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = pixelFn(x / (width - 1), y / (height - 1), x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Distance from point to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Check if point is inside polygon
function isInsidePoly(px, py, vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0], yi = vertices[i][1];
    const xj = vertices[j][0], yj = vertices[j][1];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Distance to polygon boundary
function distToPolyBoundary(px, py, vertices) {
  let minDist = Infinity;
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    const d = distToSegment(px, py, vertices[i][0], vertices[i][1], vertices[next][0], vertices[next][1]);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

// DECIORA Insignia Renderer in normalized coordinates (0 to 1)
function decioraPixelShader(u, v, x, y, width, height) {
  // Center is at (0.5, 0.5)
  const cx = 0.5;
  const cy = 0.5;
  const dx = u - cx;
  const dy = v - cy;
  const distFromCenter = Math.hypot(dx, dy);

  // Hexagon vertices in normalized coords
  const hex = [
    [0.5, 0.05],
    [0.90, 0.28],
    [0.90, 0.72],
    [0.5, 0.95],
    [0.10, 0.72],
    [0.10, 0.28]
  ];

  const insideHex = isInsidePoly(u, v, hex);
  const borderDist = distToPolyBoundary(u, v, hex);

  // Background outside hexagon is transparent
  if (!insideHex && borderDist > 0.04) {
    return [0, 0, 0, 0];
  }

  // Hexagon outer glowing cyan border (0.03 width)
  if (borderDist <= 0.035) {
    const alpha = Math.min(255, Math.floor(Math.max(0, 1 - (borderDist / 0.035)) * 255));
    // Bright cyan #38BDF8 -> [56, 189, 248]
    return [56, 189, 248, alpha];
  }

  // If outside after border
  if (!insideHex) {
    return [0, 0, 0, 0];
  }

  // Radar circular rings
  const ring1Dist = Math.abs(distFromCenter - 0.32);
  const ring2Dist = Math.abs(distFromCenter - 0.20);
  if (ring1Dist < 0.015) {
    return [56, 189, 248, 140];
  }
  if (ring2Dist < 0.012) {
    return [56, 189, 248, 120];
  }

  // Crosshairs
  if ((Math.abs(dx) < 0.012 && distFromCenter > 0.20 && distFromCenter < 0.42) ||
      (Math.abs(dy) < 0.012 && distFromCenter > 0.20 && distFromCenter < 0.42)) {
    return [56, 189, 248, 180];
  }

  // Central Chevron Delta Apex (Tactical Arrow pointing UP)
  // Polygon: [0.5, 0.30], [0.65, 0.60], [0.5, 0.52], [0.35, 0.60]
  const chevron = [
    [0.50, 0.28],
    [0.66, 0.62],
    [0.50, 0.54],
    [0.34, 0.62]
  ];
  if (isInsidePoly(u, v, chevron)) {
    // Gradient from cyan #7DD3FC at top to #0284C7 at bottom
    const grad = Math.max(0, Math.min(1, (v - 0.28) / 0.34));
    const r = Math.round(125 * (1 - grad) + 2 * grad);
    const g = Math.round(211 * (1 - grad) + 132 * grad);
    const b = Math.round(252 * (1 - grad) + 199 * grad);
    return [r, g, b, 255];
  }

  // Green radio signal wave arc above chevron
  // Arc at radius 0.24, centered at (0.5, 0.45), angles between -150 and -30 deg (pointing up)
  const arcDx = u - 0.5;
  const arcDy = v - 0.42;
  const arcDist = Math.hypot(arcDx, arcDy);
  if (arcDy < 0 && Math.abs(arcDist - 0.16) < 0.018 && Math.abs(arcDx) < 0.16) {
    return [34, 197, 94, 255]; // Neon emerald green #22C55E
  }

  // Central glowing core pulse dot
  if (distFromCenter < 0.045) {
    return [255, 255, 255, 255];
  }

  // Deep Tactical Navy Bezel Fill with radial vignette (#12263A to #07111F)
  const bgGrad = Math.min(1, distFromCenter / 0.5);
  const bgR = Math.round(18 * (1 - bgGrad) + 7 * bgGrad);
  const bgG = Math.round(38 * (1 - bgGrad) + 17 * bgGrad);
  const bgB = Math.round(58 * (1 - bgGrad) + 31 * bgGrad);
  return [bgR, bgG, bgB, 255];
}

function createICO(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let offset = 6 + count * 16;

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry[0] = width >= 256 ? 0 : width;
    entry[1] = height >= 256 ? 0 : height;
    entry[2] = 0; // Colors
    entry[3] = 0; // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // BPP
    entry.writeUInt32LE(buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(p => p.buffer)
  ]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating DECIORA high-fidelity tactical icons for browser...');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

const generatedPngs = [];

for (const { name, size } of sizes) {
  const png = createPNG(size, size, decioraPixelShader);
  const filePath = path.join(publicDir, name);
  fs.writeFileSync(filePath, png);
  console.log(`✓ Created ${name} (${size}x${size}, ${png.length} bytes)`);
  if (size <= 48) {
    generatedPngs.push({ width: size, height: size, buffer: png });
  }
}

// Generate multi-resolution favicon.ico
const ico = createICO(generatedPngs);
const icoPath = path.join(publicDir, 'favicon.ico');
fs.writeFileSync(icoPath, ico);
console.log(`✓ Created favicon.ico with 16x16, 32x32, 48x48 layers (${ico.length} bytes)`);

// Generate Web App Manifest
const manifest = {
  name: "DECIORA Tactical Decision Training Simulator",
  short_name: "DECIORA",
  description: "PS26048: Professional military-inspired decision-making training simulator under degraded communications and uncertainty.",
  start_url: "/",
  display: "standalone",
  background_color: "#07111F",
  theme_color: "#07111F",
  orientation: "any",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml"
    }
  ],
  categories: ["education", "simulation", "productivity"]
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(publicDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
console.log('✓ Created manifest.json and manifest.webmanifest');
