import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageProps } from 'react-native';
import { getCachedImageUri, invalidateCachedImage } from 'utils/imageCache';

export interface CachedImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string };
}

export const CachedImage: React.FC<CachedImageProps> = ({
  source,
  ...rest
}) => {
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);
  const retriedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    setResolvedUri(null);
    retriedRef.current = false;
    (async () => {
      try {
        const local = await getCachedImageUri(source.uri);
        if (isMounted) setResolvedUri(local);
      } catch {
        if (isMounted) setResolvedUri(source.uri);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [source.uri]);

  const handleError = async () => {
    if (retriedRef.current) return;
    retriedRef.current = true;
    try {
      await invalidateCachedImage(source.uri);
      const local = await getCachedImageUri(source.uri);
      setResolvedUri(local);
    } catch {
      setResolvedUri(source.uri);
    }
  };

  return (
    <Image
      {...rest}
      source={{ uri: resolvedUri || undefined }}
      onError={handleError}
    />
  );
};
