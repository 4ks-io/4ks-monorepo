import React, { useEffect, useState } from 'react';
import { models_RecipeMedia } from '@4ks/api-fetch';
import { Image, ImageFit, ImageLoadState } from '@fluentui/react/lib/Image';
import { RecipeMediaSize } from '../../../../types';
import { useAppConfigContext } from '../../../../providers';

interface RecipeMediaViewImageProps {
  media: models_RecipeMedia;
}

export function RecipeMediaViewImage({ media }: RecipeMediaViewImageProps) {
  const atx = useAppConfigContext();
  const [imageSrc, setImageSrc] = useState<string>();
  const [filename, setFilename] = useState('unknown');

  useEffect(() => {
    if (media.variants) {
      let sm = media.variants.filter((v) => v.alias == RecipeMediaSize.SM)[0];
      setImageSrc(sm.url);
      setFilename(`${sm.filename}`);
    } else {
      setRandomImage();
    }
  }, []);

  function setRandomImage() {
    const random = Math.floor(Math.random() * 27);
    setImageSrc(`${atx.MEDIA_FALLBACK_URL}/f${random}.jpg`);
  }

  function handleError(loadState: ImageLoadState) {
    if (loadState == ImageLoadState.error) {
      setRandomImage();
    }
  }

  return (
    <Image
      key={media.id}
      src={imageSrc}
      onLoadingStateChange={handleError}
      imageFit={ImageFit.cover}
      alt={filename}
      width={256}
      height={160}
    />
  );
}
