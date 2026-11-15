import type { ImageMetadata } from 'astro';

/**
 * Your photo, if present: save it as src/assets/headshot.jpg (or .png/.webp/.avif).
 * It appears next to your name in the top bar; without it the "EK" monogram is used.
 */
const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/headshot.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export const headshot: ImageMetadata | undefined = Object.values(photos)[0]?.default;
