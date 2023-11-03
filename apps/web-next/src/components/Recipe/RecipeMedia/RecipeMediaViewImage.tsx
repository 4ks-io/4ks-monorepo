import React, { useEffect, useState, useMemo } from 'react';
import { models_RecipeMedia } from '@4ks/api-fetch';
import { RecipeMediaSize } from '../../../../types';
import { useAppConfigContext } from '../../../../providers';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';

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

  const random = useMemo(() => Math.floor(Math.random() * 27), []);

  function setRandomImage() {
    setImageSrc(`${atx.MEDIA_FALLBACK_URL}/f${random}.jpg`);
  }

  // function handleError(loadState: ImageLoadState) {
  //   if (loadState == ImageLoadState.error) {
  //     setRandomImage();
  //   }
  // }

  return (
    <Grid xs={12} md={6} lg={4} key={media.id}>
      <Stack direction="row" justifyContent="center" alignItems="center">
        {imageSrc ? (
          <Box
            component="img"
            sx={{
              height: 256,
              width: 384,
              maxHeight: { xs: 256, md: 256 },
              maxWidth: { xs: 384, md: 384 },
            }}
            alt={filename}
            src={imageSrc}
          />
        ) : (
          <Skeleton variant="rectangular" width={384} height={256} />
        )}
      </Stack>
    </Grid>
  );

  // return (
  //   <Image
  //     key={media.id}
  //     src={imageSrc}
  //     onLoadingStateChange={handleError}
  //     imageFit={ImageFit.cover}
  //     alt={filename}
  //     width={256}
  //     height={160}
  //   />
  // );
}
