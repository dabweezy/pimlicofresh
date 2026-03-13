#!/usr/bin/env node
/**
 * Generate menu item images using NanoBanana API.
 * Usage: NANOBANANA_API_KEY=your_key node scripts/generate-menu-images.js
 * Optional: node scripts/generate-menu-images.js --limit 5  (generate only first 5)
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.nanobananaapi.ai';
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 60; // 5 min max per image

// Unique menu item names (exact h4 text from HTML; duplicates share same image)
const MENU_ITEMS = [
  'Homemade Beef Lasagne',
  'Handmade Italian Tortellini',
  'Spinach Or Quiche Lorraine',
  'Chilli & Bacon Eggs',
  'Spanish Eggs',
  'Veggie Eggs',
  'Goats Cheese & Chives',
  'Green Eggs',
  'Scrambled Eggs',
  'Sweet',
  'Savoury',
  'Sweet & Salty',
  'Salmon, Cream Cheese & Avocado',
  'Avocado & Vegemite',
  'Avocado, Feta & Mint',
  'Avocado & Salsa',
  'Beef Stew',
  'Cumberland Sausage',
  'Classic Meat Pie',
  'Soup',
  'Cheesy Beans',
  'Tuna Melt',
  'Smoked Salmon & Cream Cheese',
  'Scrambled',
  'Poached',
  'Fried',
  'Benedict',
  'Florentine',
  'Green',
  'Salmon Royale',
  'Pimlico Breakfast',
  'Hot Porridge',
  'Homemade Granola',
  'Vegan Coconut Porridge',
  'Mushroom Breakfast',
  'Toasted Sandwiches',
  'Brioche Buns',
];

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildPrompt(name) {
  return `Professional appetizing restaurant food photography of ${name}, cafe menu style, warm natural lighting, white plate, shallow depth of field, high quality`;
}

async function generateImage(apiKey, name) {
  const prompt = buildPrompt(name);
  const res = await fetch(`${API_BASE}/api/v1/nanobanana/generate-2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      imageUrls: [],
      aspectRatio: '4:3',
      resolution: '1K',
      outputFormat: 'jpg',
    }),
  });

  const json = await res.json();
  if (json.code !== 200 || !json.data?.taskId) {
    throw new Error(json.message || json.msg || 'Generate request failed');
  }
  return json.data.taskId;
}

async function pollForResult(apiKey, taskId) {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const res = await fetch(
      `${API_BASE}/api/v1/nanobanana/record-info?taskId=${encodeURIComponent(taskId)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );
    const json = await res.json();
    if (json.code !== 200) throw new Error(json.msg || 'Poll failed');
    const flag = json.data?.successFlag;
    if (flag === 1) {
      const url = json.data?.response?.resultImageUrl;
      if (!url) throw new Error('No image URL in response');
      return url;
    }
    if (flag === 2 || flag === 3) {
      throw new Error(json.data?.errorMessage || 'Generation failed');
    }
  }
  throw new Error('Poll timeout');
}

async function downloadImage(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filePath, buf);
}

async function main() {
  const apiKey = process.env.NANOBANANA_API_KEY;
  if (!apiKey) {
    console.error('Set NANOBANANA_API_KEY in the environment.');
    console.error('Get a key at https://nanobananaapi.ai/api-key');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1], 10) : undefined;
  const items = limit ? MENU_ITEMS.slice(0, limit) : MENU_ITEMS;

  const outDir = path.join(__dirname, '..', 'assets', 'menu');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating ${items.length} menu images via NanoBanana...`);

  for (let i = 0; i < items.length; i++) {
    const name = items[i];
    const s = slug(name);
    const filePath = path.join(outDir, `${s}.jpg`);
    if (fs.existsSync(filePath)) {
      console.log(`[${i + 1}/${items.length}] Skip (exists): ${name} -> ${s}.jpg`);
      continue;
    }
    try {
      console.log(`[${i + 1}/${items.length}] Generating: ${name}`);
      const taskId = await generateImage(apiKey, name);
      const imageUrl = await pollForResult(apiKey, taskId);
      await downloadImage(imageUrl, filePath);
      console.log(`[${i + 1}/${items.length}] Saved: ${s}.jpg`);
    } catch (err) {
      console.error(`[${i + 1}/${items.length}] Error for "${name}":`, err.message);
    }
  }

  console.log('Done.');
}

main();
