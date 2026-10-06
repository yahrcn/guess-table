import { getMediaDesign, type MediaDeckKind } from './mediaDesigns';
import { renderMediaIcon } from './mediaIcons';

interface Props {
  cardId: string;
  size?: number;
  title?: string;
  variant: MediaDeckKind;
}

/**
 * "Poster tile" SVG rendered from a hand-chosen design per card id (see mediaDesigns.ts) —
 * the icon is picked by hand to fit the specific title's genre/subject, never computed
 * from a hash. Pure geometry — never a real poster, box art or logo.
 */
export const MediaAvatar = ({ cardId, size = 96, title, variant }: Props) => {
  const { bg, accent, icon } = getMediaDesign(variant, cardId);

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? 'Сгенерированная иллюстрация'}>
      <rect width="100" height="100" rx="16" fill={bg} />
      {renderMediaIcon(icon, accent, bg)}
    </svg>
  );
};
