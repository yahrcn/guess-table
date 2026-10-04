import { hashSeed } from '../avatarHash';

const BG_COLORS = ['#1D2B53', '#7A1F3D', '#2E3A1F', '#3A1F4D', '#1F3A3A', '#4D2E1F', '#1F2E4D'];
const ACCENT_COLORS = ['#F4A261', '#4CC9F0', '#F72585', '#8AB17D', '#FFD166', '#B388EB', '#FF8FA3'];

interface Props {
  seed: string;
  size?: number;
  title?: string;
  variant: 'movie' | 'game';
}

/**
 * Deterministic "poster tile" SVG generated from `seed` — used for Movies/VideoGames
 * decks, where a human/animal face wouldn't make sense. Pure geometry, never a real
 * poster, box art or logo.
 */
export const MediaAvatar = ({ seed, size = 96, title, variant }: Props) => {
  const hash = hashSeed(seed);
  const bg = BG_COLORS[hash % BG_COLORS.length];
  const accent = ACCENT_COLORS[Math.floor(hash / 7) % ACCENT_COLORS.length];
  const shapeStyle = Math.floor(hash / 49) % 3;
  const perforations = Array.from({ length: 6 }, (_, i) => 8 + i * 15);

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? 'Сгенерированная иллюстрация'}>
      <rect width="100" height="100" rx="16" fill={bg} />

      {variant === 'movie' ? (
        <>
          <g fill="#00000040">
            {perforations.map((x) => (
              <rect key={`t-${x}`} x={x} y="4" width="7" height="7" rx="1.5" />
            ))}
            {perforations.map((x) => (
              <rect key={`b-${x}`} x={x} y="89" width="7" height="7" rx="1.5" />
            ))}
          </g>
          {shapeStyle === 0 && <path d="M40 30 L72 50 L40 70 Z" fill={accent} />}
          {shapeStyle === 1 && (
            <path
              d="M50 24 L58 42 L78 44 L62 57 L67 76 L50 65 L33 76 L38 57 L22 44 L42 42 Z"
              fill={accent}
            />
          )}
          {shapeStyle === 2 && <circle cx="50" cy="50" r="22" fill="none" stroke={accent} strokeWidth="6" />}
        </>
      ) : (
        <>
          {renderPixelBlob(hash, accent)}
        </>
      )}
    </svg>
  );
};

/** A small deterministic 5x5 pixel-art-style blob, evoking "8-bit game" without copying any real sprite. */
function renderPixelBlob(hash: number, color: string) {
  const gridSize = 5;
  const cell = 12;
  const offset = 50 - (gridSize * cell) / 2;
  const cells: Array<[number, number]> = [];

  // Mirror the left half onto the right half so the blob reads as one coherent shape.
  const half = Math.ceil(gridSize / 2);
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < half; col++) {
      const bit = (hash >> (row * half + col)) & 1;
      if (bit === 1) {
        cells.push([row, col]);
        const mirroredCol = gridSize - 1 - col;
        if (mirroredCol !== col) cells.push([row, mirroredCol]);
      }
    }
  }

  return (
    <g fill={color}>
      {cells.map(([row, col]) => (
        <rect key={`${row}-${col}`} x={offset + col * cell} y={offset + row * cell} width={cell - 2} height={cell - 2} rx="2" />
      ))}
    </g>
  );
}
