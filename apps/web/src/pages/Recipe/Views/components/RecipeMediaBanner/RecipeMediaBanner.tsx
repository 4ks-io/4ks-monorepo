import React, { useState, useEffect, useMemo } from 'react';
import { useRecipeContext } from '../../../../../providers';
import { models_RecipeMediaVariant } from '@4ks/api-fetch';
import { RecipeMediaSize } from '../../../../../types';
import { useAppConfigContext } from '../../../../../providers';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const RecipeMediaBanner = () => {
  const atx = useAppConfigContext();
  const rtx = useRecipeContext();
  const [imageSrc, setImageSrc] = useState<string>();
  const [showBannerSelectModal, setShowBannerSelectModal] = useState(false);

  const [selectingMediaId, setSelectingMediaId] = useState<string>();
  const [selectingMedia, setSelectingMedia] =
    useState<models_RecipeMediaVariant[]>();

  const random = useMemo(() => Math.floor(Math.random() * 27), []);

  function setRandomImage() {
    setImageSrc(`${atx.MEDIA_FALLBACK_URL}/f${random}.jpg`);
  }

  function getBannerVariantUrl(
    variants: models_RecipeMediaVariant[] | undefined,
    size: RecipeMediaSize = RecipeMediaSize.MD
  ): models_RecipeMediaVariant | undefined {
    return variants && variants.filter((v) => v.alias == size)[0];
  }

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.banner) {
      const md = getBannerVariantUrl(rtx.recipe.currentRevision.banner);
      md?.url && typeof md.url == 'string' && setImageSrc(md.url);
    } else {
      setRandomImage();
    }
  }, [rtx]);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.banner) {
      const bannerImg = getBannerVariantUrl(rtx.recipe.currentRevision.banner);
      if (showBannerSelectModal) {
        const newBannerImg = getBannerVariantUrl(selectingMedia);
        setImageSrc(newBannerImg?.url || bannerImg?.url);
      } else {
        setImageSrc(bannerImg?.url || undefined);
      }
    }
  }, [showBannerSelectModal, selectingMedia]);

  // todo: save currently happens in RecipeControls. Fix flow.
  function confirmImageSelection() {
    selectingMedia && rtx.setBanner(selectingMedia);
    setShowBannerSelectModal(false);
  }

  function discardImageSelection() {
    setSelectingMedia(undefined);
    setSelectingMediaId(undefined);
    setShowBannerSelectModal(false);
  }

  function handleOpenBannerSelectModal() {
    if (rtx.media && rtx.media.length > 0) {
      setShowBannerSelectModal(true);
    }
  }

  return (
    <div style={{ height: '256px' }}>
      <Dialog open={showBannerSelectModal} onClose={discardImageSelection}>
        <DialogTitle>Select Banner Image</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {rtx.media.map((m) => {
              let sm = getBannerVariantUrl(m?.variants, RecipeMediaSize.SM);
              if (!sm) {
                return;
              }
              const isSelectedStyle =
                m.id == selectingMediaId
                  ? {
                      borderStyle: 'solid',
                      border: '2px solid rgb(0, 120, 212)',
                    }
                  : {};
              return (
                <div key={m.id} style={isSelectedStyle}>
                  <Box
                    component="img"
                    onClick={() => {
                      setSelectingMedia(m?.variants);
                      setSelectingMediaId(m.id);
                    }}
                    sx={{
                      height: 256,
                      width: '100%',
                      maxHeight: { xs: 256, md: 256 },
                      overflow: 'hidden',
                    }}
                    alt={sm.filename}
                    src={sm.url}
                  />
                </div>
              );
            })}
          </Grid>
          <Stack direction="row">
            <Button onClick={confirmImageSelection}>Select</Button>
            <span style={{ marginLeft: '8px' }}></span>
            <Button onClick={discardImageSelection}>Cancel</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Box
        component="img"
        onClick={handleOpenBannerSelectModal}
        sx={{
          height: 256,
          width: '100%',
          maxHeight: { xs: 256, md: 256 },
          // maxWidth: { xs: 384, md: 384 },
          overflow: 'hidden',
        }}
        alt="banner image"
        src={imageSrc}
      />
    </div>
  );
};

export default RecipeMediaBanner;
