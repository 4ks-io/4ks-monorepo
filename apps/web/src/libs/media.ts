import { models_RecipeMediaVariant } from '@4ks/api-fetch';

export enum RecipeMediaSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export function getRecipeBannerVariantUrl(
  variants: models_RecipeMediaVariant[] | undefined,
  size: RecipeMediaSize = RecipeMediaSize.MD
): models_RecipeMediaVariant | undefined {
  return variants && variants.filter((v) => v.alias == size)[0];
}
