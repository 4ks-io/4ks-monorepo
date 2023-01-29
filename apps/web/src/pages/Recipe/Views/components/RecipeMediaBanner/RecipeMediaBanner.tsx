import React, { useState, useEffect } from 'react';
import { Image, ImageFit, ImageLoadState } from '@fluentui/react/lib/Image';
import { Stack, IStackProps } from '@fluentui/react/lib/Stack';
import {
  PrimaryButton,
  DefaultButton,
  IButtonStyles,
} from '@fluentui/react/lib/Button';
import { useRecipeContext } from '../../../../../providers/recipe-context';
import { IconButton } from '@fluentui/react/lib/Button';
import { Modal } from '@fluentui/react/lib/Modal';
import { models_RecipeMediaVariant } from '@4ks/api-fetch';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  IIconProps,
} from '@fluentui/react';

const RecipeMediaBanner = () => {
  const rtx = useRecipeContext();
  const [bannerImgSrc, setBannerImgSrc] = useState<string>();

  const [showBannerSelectModal, setShowBannerSelectModal] = useState(false);

  // const bannerPlaceholder =
  //   'https://fabricweb.azureedge.net/fabric-website/placeholders/500x500.png';

  const [selectedMedia, setSelectedMedia] =
    useState<models_RecipeMediaVariant[]>();

  const [selectingMediaId, setSelectingMediaId] = useState<string>();
  const [selectingMedia, setSelectingMedia] =
    useState<models_RecipeMediaVariant[]>();

  enum RecipeMediaSize {
    SM = 'sm',
    MD = 'md',
    ORIG = 'orig',
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
      md?.url && typeof md.url == 'string' && setBannerImgSrc(md.url);
    }
  }, [rtx]);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.banner) {
      const bannerImg = getBannerVariantUrl(rtx.recipe.currentRevision.banner);
      if (showBannerSelectModal) {
        const newBannerImg = getBannerVariantUrl(selectingMedia);
        setBannerImgSrc(newBannerImg?.url || bannerImg?.url);
      } else {
        setBannerImgSrc(bannerImg?.url || undefined);
      }
    }
  }, [showBannerSelectModal, selectingMedia, selectedMedia]);

  // todo: save currently happens in RecipeControls. Fix flow.
  function confirmImageSelection() {
    setSelectedMedia(selectingMedia);
    selectingMedia && rtx?.setBanner(selectingMedia);
    setShowBannerSelectModal(false);
  }

  function discardImageSelection() {
    setSelectingMedia(undefined);
    setSelectingMediaId(undefined);
    setShowBannerSelectModal(false);
  }

  return (
    <div style={{ height: '256px' }}>
      <Modal
        isOpen={showBannerSelectModal}
        onDismiss={discardImageSelection}
        isBlocking={false}
      >
        <div className={contentStyles.header}>
          <h2 className={contentStyles.heading} id={'someId'}>
            Select Banner Image
          </h2>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close"
            onClick={discardImageSelection}
          />
        </div>
        <div className={contentStyles.body}>
          <Stack horizontal wrap tokens={{ childrenGap: 30 }}>
            {rtx.media.map((m) => {
              let sm = getBannerVariantUrl(m?.variants, RecipeMediaSize.SM);
              const isSelectedStyle =
                m.id == selectingMediaId
                  ? {
                      borderStyle: 'solid',
                      border: '2px solid rgb(0, 120, 212)',
                    }
                  : {};
              return (
                <div key={m.id} style={isSelectedStyle}>
                  <Image
                    src={sm.url}
                    onLoadingStateChange={(loadState: ImageLoadState) => {
                      console.log(loadState);
                    }}
                    imageFit={ImageFit.cover}
                    alt={sm.filename}
                    width={256}
                    height={160}
                    onClick={() => {
                      setSelectingMedia(m?.variants);
                      setSelectingMediaId(m.id);
                    }}
                  />
                </div>
              );
            })}
          </Stack>
          <Stack>
            <Stack.Item align="end">
              <PrimaryButton onClick={confirmImageSelection} text="Select" />
              <span style={{ marginLeft: '8px' }}></span>
              <DefaultButton onClick={discardImageSelection} text="Cancel" />
            </Stack.Item>
          </Stack>
        </div>
      </Modal>

      <Image
        onClick={() => setShowBannerSelectModal(true)}
        maximizeFrame={true}
        imageFit={ImageFit.cover}
        alt="banner image"
        src={bannerImgSrc}
      />
    </div>
  );
};

export default RecipeMediaBanner;

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xxLarge,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: 'inherit',
    margin: '0',
  },
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const stackProps: Partial<IStackProps> = {
  horizontal: true,
  tokens: { childrenGap: 40 },
  styles: { root: { marginBottom: 20 } },
};
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
