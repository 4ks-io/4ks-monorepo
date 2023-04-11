import React, { useState, useEffect, useMemo } from 'react';
import { useRecipeContext } from '../../../../../providers';
import { models_RecipeMediaVariant } from '@4ks/api-fetch';
import { RecipeMediaSize } from '../../../../../types';
import { useAppConfigContext } from '../../../../../providers';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RecipeMediaBannerImagePreview from './RecipeMediaBannerImagePreview';

export function getBannerVariantUrl(
  variants: models_RecipeMediaVariant[] | undefined,
  size: RecipeMediaSize = RecipeMediaSize.MD
): models_RecipeMediaVariant | undefined {
  return variants && variants.filter((v) => v.alias == size)[0];
}

const RecipeMediaBanner = () => {
  const atx = useAppConfigContext();
  const rtx = useRecipeContext();

  const [imageSrc, setImageSrc] = useState<string>();
  const [showBanner, setShowBanner] = useState(true);
  const [showBannerSelectModal, setShowBannerSelectModal] = useState(false);

  const [selectingMediaId, setSelectingMediaId] = useState<string>();
  const [selectingMedia, setSelectingMedia] =
    useState<models_RecipeMediaVariant[]>();

  const random = useMemo(() => Math.floor(Math.random() * 27), []);

  function setRandomImage() {
    setImageSrc(`${atx.MEDIA_FALLBACK_URL}/f${random}.jpg`);
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
    <>
      <Dialog open={showBannerSelectModal} onClose={discardImageSelection}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Select Banner Image
          <IconButton
            aria-label="close"
            onClick={discardImageSelection}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {rtx.media.map((m) =>
              RecipeMediaBannerImagePreview({
                media: m,
                selectingMediaId,
                setSelectingMedia,
                setSelectingMediaId,
              })
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmImageSelection}>Select</Button>
          <span style={{ marginLeft: '8px' }}></span>
          <Button onClick={discardImageSelection}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Banner Image */}
      {showBanner && (
        <Button
          variant="text"
          onClick={() => setShowBanner(!showBanner)}
          sx={{ paddingBottom: 2, width: '100%' }}
        >
          <ExpandLessIcon />
        </Button>
      )}
      {showBanner && (
        <Box
          component="img"
          onClick={handleOpenBannerSelectModal}
          sx={{
            width: '100%',
            overflow: 'hidden',
          }}
          alt="banner image"
          src={imageSrc}
        />
      )}
      <Button
        variant="text"
        onClick={() => setShowBanner(!showBanner)}
        sx={{ paddingBottom: 2, width: '100%' }}
      >
        {showBanner ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>
    </>
  );
};

export default RecipeMediaBanner;
