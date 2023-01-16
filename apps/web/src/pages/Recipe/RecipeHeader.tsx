import React, { useEffect, useState } from 'react';
import { Image, IImageProps, ImageFit } from '@fluentui/react/lib/Image';
import { useNavigate } from 'react-router-dom';
import { Stack, IStackProps } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { useRecipeContext } from '../../providers/recipe-context';
import { useSessionContext } from '../../providers/session-context';
import { IconButton } from '@fluentui/react/lib/Button';
import Skeleton from 'react-loading-skeleton';
import { Label } from '@fluentui/react/lib/Label';
import { Modal } from '@fluentui/react/lib/Modal';
import { models_RecipeMedia } from '@4ks/api-fetch';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  IIconProps,
} from '@fluentui/react';

interface RecipeHeaderProps {}

const GENERIC_TITLE = `INSERT TITLE HERE`;

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(false);
  const [hideBannerSelectModal, setHideBannerSelectModal] = useState(true);
  const [title, setTitle] = useState('');
  const [medias, setMedias] = useState<models_RecipeMedia[]>([]);
  const [bannerImgSrc, setBannerImgSrc] = useState(
    'https://fabricweb.azureedge.net/fabric-website/placeholders/500x500.png'
  );

  function handleTitleFocus() {
    if (title == GENERIC_TITLE) {
      setTitle(``);
    }
  }

  function handleTitleBlur() {
    if (title == '') {
      setTitle(GENERIC_TITLE);
    }
  }

  function handleTitleChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setTitle(`${newValue}`);
  }

  useEffect(() => {
    if (rtx?.recipeId == '0') {
      setIsNew(true);
      setTitle(GENERIC_TITLE);
    }
  }, [rtx?.recipeId]);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.name) {
      setTitle(rtx?.recipe?.currentRevision?.name);
    }
  }, [rtx?.recipe.currentRevision]);

  function forkThisRecipe() {
    ctx.api?.recipes.postRecipesFork(`${rtx?.recipeId}`).then((r) => {
      navigate(`/r/${r.id}`);
    });
  }

  function starThisRecipe() {
    ctx.api?.recipes.postRecipesStar(`${rtx?.recipeId}`).then(() => {
      navigate(`/r/${rtx?.recipeId}`);
      // todo => refresh recipe
    });
  }

  function shareThisRecipe() {
    alert('Share!');
  }

  function handleValidationComplete() {
    rtx?.setTitle(title);
  }

  const userBreadcrumb: IBreadcrumbItem = {
    text: '@' + (rtx?.recipe?.author?.username || ctx.user?.username),
    key: 'UserName',
    href: encodeURI(`/${rtx?.recipe?.author?.username}`),
  };

  function getCountLabel(c: number | undefined) {
    return c && c > 0 ? ' (' + c + ')' : '';
  }

  const showBannerModal = () => setHideBannerSelectModal(false);
  const hideBannerModal = () => setHideBannerSelectModal(true);

  const forksCountLabel = getCountLabel(rtx?.recipe.metadata?.forks);
  const starsCountLabel = getCountLabel(rtx?.recipe.metadata?.stars);

  async function getMedia() {
    const medias = await ctx.api?.recipes.getRecipesMedia(
      `${rtx?.recipe?.root}`
    );
    medias && setMedias(medias);
  }

  useEffect(() => {
    if (medias && medias.length > 0) {
      setBannerImgSrc(medias[0].variants[0].url);
    }
  }, [medias]);

  useEffect(() => {
    hideBannerSelectModal && getMedia();
  }, [hideBannerSelectModal]);

  return (
    <Stack.Item align="stretch">
      <div style={{ height: '256px' }}>
        <Modal
          // titleAriaId={titleId}
          isOpen={!hideBannerSelectModal}
          onDismiss={hideBannerModal}
          isBlocking={false}
          // containerClassName={contentStyles.container}
          // dragOptions={isDraggable ? dragOptions : undefined}
        >
          <div className={contentStyles.header}>
            <h2 className={contentStyles.heading} id={'someId'}>
              Select Banner Image
            </h2>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close"
              onClick={hideBannerModal}
            />
          </div>
          <div className={contentStyles.body}>
            <Stack horizontal wrap tokens={{ childrenGap: 30 }}>
              {medias.map((m) => {
                let sm = m?.variants.filter((v) => v.alias == 'sm')[0];
                return (
                  <Image
                    key={m.id}
                    src={sm.url}
                    imageFit={ImageFit.cover}
                    alt={sm.filename}
                    width={256}
                    height={160}
                  />
                );
              })}
            </Stack>
            <Stack>
              <Stack.Item align="end">
                <PrimaryButton onClick={hideBannerModal} text="Select" />
                <span style={{ marginLeft: '8px' }}></span>
                <DefaultButton onClick={hideBannerModal} text="Cancel" />
              </Stack.Item>
            </Stack>
          </div>
        </Modal>

        <Image
          onClick={showBannerModal}
          maximizeFrame={true}
          imageFit={ImageFit.cover}
          alt="banner image"
          src={bannerImgSrc}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        {userBreadcrumb.text.length > 0 ? (
          <Breadcrumb
            items={[userBreadcrumb]}
            maxDisplayedItems={1}
            ariaLabel="headercrums"
            // style={{ fontWeight: 400 }}
            // overflowAriaLabel="More links"
          />
        ) : (
          <Skeleton />
        )}
        {rtx?.editing ? (
          <Stack horizontal horizontalAlign="start">
            <Stack
              horizontal
              horizontalAlign="start"
              style={{ margin: '11px 0px 1px' }}
            >
              <IconButton
                iconProps={{ iconName: 'EditMirrored' }}
                aria-label="EditMirrored"
              />
              <TextField
                onFocus={handleTitleFocus}
                onBlur={handleTitleBlur}
                onChange={handleTitleChange}
                style={{ fontWeight: 600, fontSize: '18px' }}
                styles={{
                  field: {
                    fontSize: 16,
                    width: 400,
                  },
                }}
                borderless
                readOnly={false}
                validateOnFocusOut={true}
                onNotifyValidationResult={handleValidationComplete}
                value={title}
              />
            </Stack>
          </Stack>
        ) : (
          <>
            {title.length > 0 ? (
              <Label
                styles={{
                  root: {
                    fontSize: 20,
                    height: '40px',
                    paddingLeft: 8,
                    marginBottom: 40,
                  },
                }}
              >
                {title}
              </Label>
            ) : (
              <Skeleton />
            )}
          </>
        )}
      </div>
      {isNew && (
        <Stack horizontal horizontalAlign="space-evenly">
          <DefaultButton
            iconProps={{ iconName: 'BranchFork2' }}
            text={`Fork${forksCountLabel}`}
            onClick={forkThisRecipe}
          />
          <DefaultButton
            iconProps={{ iconName: 'FavoriteStar' }}
            text={`Star${starsCountLabel}`}
            onClick={starThisRecipe}
          />
          <DefaultButton
            iconProps={{ iconName: 'SocialListeningLogo' }}
            text="Share"
            onClick={shareThisRecipe}
          />
        </Stack>
      )}
    </Stack.Item>
  );
}

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
