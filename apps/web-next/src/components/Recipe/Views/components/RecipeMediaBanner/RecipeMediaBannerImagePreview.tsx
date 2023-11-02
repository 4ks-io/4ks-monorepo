import React from 'react';
import { models_RecipeMediaVariant } from '@4ks/api-fetch';
import { RecipeMediaSize } from '../types';
import Box from '@mui/material/Box';
import { models_RecipeMedia } from '@4ks/api-fetch';
import { getBannerVariantUrl } from './RecipeMediaBanner';

interface RecipeMediaBannerImagePreviewProps {
  media: models_RecipeMedia;
  selectingMediaId: string | undefined;
  setSelectingMedia: React.Dispatch<
    React.SetStateAction<models_RecipeMediaVariant[] | undefined>
  >;
  setSelectingMediaId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const RecipeMediaBannerImagePreview = ({
  media,
  selectingMediaId,
  setSelectingMedia,
  setSelectingMediaId,
}: RecipeMediaBannerImagePreviewProps) => {
  let sm = getBannerVariantUrl(media?.variants, RecipeMediaSize.SM);
  if (!sm) {
    return;
  }

  const isSelectedStyle =
    media.id == selectingMediaId
      ? {
          borderStyle: 'solid',
          border: '2px solid rgb(0, 120, 212)',
        }
      : {};

  return (
    <div key={media.id} style={isSelectedStyle}>
      <Box
        component="img"
        onClick={() => {
          setSelectingMedia(media?.variants);
          setSelectingMediaId(media.id);
        }}
        sx={{
          // height: 192,
          width: '100%',
          // maxHeight: { xs: 256, md: 256 },
          overflow: 'hidden',
        }}
        alt={sm.filename}
        src={sm.url}
      />
    </div>
  );
};

export default RecipeMediaBannerImagePreview;
