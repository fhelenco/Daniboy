import { useEffect, useState, type ReactNode } from 'react';
import { assetMissing } from '../assets/preload';
import { ClayBlob } from '../placeholders/ClayBlob';

// <img> que nunca aparece quebrada: se o arquivo faltar, mostra o placeholder.
export function ClayImage({
  src,
  alt,
  className,
  fallback,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(() => assetMissing(src));
  useEffect(() => setFailed(assetMissing(src)), [src]);

  if (failed) return <>{fallback ?? <ClayBlob seed={alt} className={className} />}</>;
  return (
    <img src={src} alt={alt} draggable={false} className={className} onError={() => setFailed(true)} />
  );
}
