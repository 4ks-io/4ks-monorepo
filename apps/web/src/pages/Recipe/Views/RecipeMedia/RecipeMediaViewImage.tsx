import React, { useEffect, useState } from 'react';
import { models_RecipeMedia } from '@4ks/api-fetch';
import { Image, ImageFit, ImageLoadState } from '@fluentui/react/lib/Image';

interface RecipeMediaViewImageProps {
  media: models_RecipeMedia;
}

export function RecipeMediaViewImage({ media }: RecipeMediaViewImageProps) {
  const [imageSrc, setImageSrc] = useState<string>();
  const [filename, setFilename] = useState('unknown');

  useEffect(() => {
    if (media.variants) {
      let sm = media.variants.filter((v) => v.alias == 'sm')[0];
      setImageSrc(sm.url);
      setFilename(`${sm.filename}`);
    } else {
      setRandomImage();
    }
  }, []);

  function setRandomImage() {
    const colors = ['green', 'orange', 'red', 'yellow'];
    const random = Math.floor(Math.random() * colors.length);
    setImageSrc(
      `https://storage.googleapis.com/static.dev.4ks.io/fallback/${colors[random]}.jpg`
    );
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
