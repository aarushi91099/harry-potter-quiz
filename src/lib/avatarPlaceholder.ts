/**
 * Deterministic placeholder avatar: an SVG data URI with the subject's initials
 * on a color derived from a hash of their name. Used in place of real (copyrighted)
 * character/creature art — swap `imageUrl` in the datasets for real assets later
 * without touching any component code.
 */

import { hashString } from './hashString';

const PALETTE = [
  '#740001', // Gryffindor red
  '#0e1a40', // Ravenclaw blue
  '#ecb939', // Hufflepuff yellow
  '#1a472a', // Slytherin green
  '#5d5d5d', // neutral grey
  '#3a2f1b', // wand-brown
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function placeholderAvatarUrl(name: string): string {
  const bg = PALETTE[hashString(name) % PALETTE.length];
  const initials = initialsOf(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bg}" />
    <text x="100" y="112" font-family="system-ui, sans-serif" font-size="72" font-weight="600"
      fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
