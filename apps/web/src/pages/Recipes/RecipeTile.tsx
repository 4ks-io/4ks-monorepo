import React, { useState, useEffect } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { models_Recipe, models_RecipeMediaVariant } from '@4ks/api-fetch';
import { Text } from '@fluentui/react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { stackStyles, stackTokens, stackItemStyles } from './styles';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { RecipeMediaSize } from '../../types';
import { useAppConfigContext } from '../../providers';

const PLACEHOLDER_TAGS = ['vegan', 'beef', 'poultry', 'meat'];

function RecipeTags(recipe: models_Recipe) {
  return (
    <Stack
      horizontal
      tokens={{
        childrenGap: 4,
      }}
    >
      {PLACEHOLDER_TAGS.map((tag) => {
        return (
          <Stack.Item key={`${recipe.id}_${tag}`}>
            <Text
              style={{
                color: '#FFF',
                fontWeight: 'bold',
              }}
            >
              #{tag}
            </Text>
          </Stack.Item>
        );
      })}
    </Stack>
  );
}

function RecipeContributors(recipe: models_Recipe) {
  return (
    <Stack horizontal tokens={{ childrenGap: 4 }}>
      <Stack.Item style={{ color: '#FFF' }}>Chefs:</Stack.Item>
      {recipe.contributors?.map((contributor, idx) => (
        <Stack.Item
          style={{ fontWeight: 'bold', color: '#FFF' }}
          key={`${recipe.id}_${contributor}`}
        >
          {contributor.username}
          {idx < (recipe.contributors?.length || 0) - 1 ? ',' : ''}
        </Stack.Item>
      ))}
    </Stack>
  );
}

function getBannerVariantUrl(
  variants: models_RecipeMediaVariant[] | undefined
): models_RecipeMediaVariant | undefined {
  return variants && variants.filter((v) => v.alias == RecipeMediaSize.MD)[0];
}

interface RecipeTileProps {
  recipe: models_Recipe;
}

const containerStyles = {
  maxHeight: '256',
  position: 'relative',
};

const nestedStyles = {
  fontWeight: 'bold',
  zIndex: 2,
  width: '100%',
  float: 'left',
  position: 'absolute',
  background: 'rgba(0, 0, 0, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
};

const RecipeTile = ({ recipe }: RecipeTileProps) => {
  const atx = useAppConfigContext();
  const [imageSrc, setImageSrc] = useState<string>();

  function setRandomImage() {
    const random = Math.floor(Math.random() * 27);
    setImageSrc(`${atx.MEDIA_FALLBACK_URL}/f${random}.jpg`);
  }

  useEffect(() => {
    if (recipe?.currentRevision?.banner) {
      const i = getBannerVariantUrl(recipe.currentRevision.banner)?.url;
      setImageSrc(i);
    } else {
      setRandomImage();
    }
  }, []);

  return (
    <Stack.Item
      key={recipe.id}
      style={{
        minHeight: 96,
        width: '100%',
        maxWidth: 512,
      }}
    >
      <Stack styles={stackStyles} tokens={stackTokens}>
        <div style={containerStyles}>
          <div style={nestedStyles}>
            <Stack horizontal>
              <Stack.Item align="auto" styles={stackItemStyles}>
                <span>
                  <Link to={`/r/${recipe.id}`}>
                    <Text
                      variant="xLarge"
                      style={{ fontWeight: 'bold', color: '#FFF' }}
                    >
                      {recipe.currentRevision?.name || `missing title`}
                    </Text>
                  </Link>
                </span>
              </Stack.Item>
            </Stack>
            <RecipeTags {...recipe} />
            <RecipeContributors {...recipe} />
          </div>
          <Link to={`/r/${recipe.id}`}>
            <Image
              maximizeFrame={true}
              imageFit={ImageFit.cover}
              alt="banner image"
              src={imageSrc}
            />
          </Link>
        </div>
      </Stack>
    </Stack.Item>
  );
};

export default RecipeTile;
