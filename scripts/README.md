# Menu image generation (NanoBanana)

Generate food images for menu items using the [NanoBanana](https://nanobananaapi.ai) API.

1. **Get an API key** at [nanobananaapi.ai/api-key](https://nanobananaapi.ai/api-key).

2. **Run the script** (Node 18+):
   ```bash
   NANOBANANA_API_KEY=your_key node scripts/generate-menu-images.js
   ```
   Images are saved to `assets/menu/{slug}.jpg`.

3. **Optional:** Generate only the first few (e.g. 5) to test:
   ```bash
   NANOBANANA_API_KEY=your_key node scripts/generate-menu-images.js --limit 5
   ```

4. The site loads each image from `assets/menu/{slug}.jpg`; if a file is missing, the image is hidden.
