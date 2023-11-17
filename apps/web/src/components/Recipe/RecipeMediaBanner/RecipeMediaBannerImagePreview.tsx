import React from 'react';
import { models_RecipeMediaVariant } from '@4ks/api-fetch';
import { RecipeMediaSize } from '../types';
import Box from '@mui/material/Box';
import { models_RecipeMedia } from '@4ks/api-fetch';
import { getBannerVariantUrl } from './RecipeMediaBanner';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
interface RecipeMediaBannerImagePreviewProps {
  media: models_RecipeMedia;
  selectingMediaId: string | undefined;
  setSelectingMedia: React.Dispatch<
    React.SetStateAction<models_RecipeMediaVariant[] | undefined>
  >;
  setSelectingMediaId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function RecipeMediaBannerImagePreview({
  media,
  selectingMediaId,
  setSelectingMedia,
  setSelectingMediaId,
}: RecipeMediaBannerImagePreviewProps) {
  let sm = getBannerVariantUrl(media?.variants, RecipeMediaSize.SM);
  if (!sm) {
    return;
  }

  return (
    <Card
      key={media.id}
      onClick={() => {
        setSelectingMedia(media?.variants);
        setSelectingMediaId(media.id);
      }}
      sx={{
        maxWidth: 272,
        // height: 192,
        // width: '100%',
        margin: 1,
        // maxHeight: { xs: 256, md: 256 },
        // overflow: 'hidden',
        border:
          media.id == selectingMediaId ? '2px solid rgb(0, 120, 212)' : '',
      }}
    >
      <CardMedia
        component="img"
        alt={sm.filename}
        height="200"
        image={sm.url}
      />
    </Card>
  );
}
