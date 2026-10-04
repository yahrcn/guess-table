import { useState } from 'react';

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

interface Props {
  cardId: string;
  alt: string;
  fallback: React.ReactNode;
}

/**
 * Tries `/cards/<cardId>.{jpg,jpeg,png,webp}` (drop files there yourself — see
 * packages/client/public/cards/README.md) and falls back to the generated illustration
 * if none of them exist. No manifest to maintain: just name the file after the card id.
 */
export const CardImage = ({ cardId, alt, fallback }: Props) => {
  const [extIndex, setExtIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  if (exhausted) return <>{fallback}</>;

  return (
    <img
      src={`/cards/${cardId}.${EXTENSIONS[extIndex]}`}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      onError={() => {
        if (extIndex < EXTENSIONS.length - 1) {
          setExtIndex((index) => index + 1);
        } else {
          setExhausted(true);
        }
      }}
    />
  );
};
