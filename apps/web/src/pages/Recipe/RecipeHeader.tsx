import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import {
  Breadcrumb,
  IBreadcrumbItem,
  IDividerAsProps,
} from '@fluentui/react/lib/Breadcrumb';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { models_Recipe } from '@4ks/api-fetch';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';

function _getCustomDivider(dividerProps: IDividerAsProps): JSX.Element {
  const tooltipText = dividerProps.item ? dividerProps.item.text : '';
  return (
    <TooltipHost
      content={`Show ${tooltipText} contents`}
      calloutProps={{ gapSpace: 0 }}
    >
      <span aria-hidden="true" style={{ cursor: 'pointer', padding: 5 }}>
        /
      </span>
    </TooltipHost>
  );
}

interface RecipeHeaderProps {
  recipe: models_Recipe;
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 25px',
  });

  const crumbs: IBreadcrumbItem[] = [
    {
      text: recipe.author?.displayName || '',
      key: 'author',
      onClick: () => {},
    },
    {
      text: recipe.currentRevision?.name || '',
      key: 'recipe',
      onClick: () => {},
    },
  ];

  return (
    <Stack.Item align="stretch">
      <Stack horizontal horizontalAlign="space-between">
        <Stack.Item align="stretch">
          <Breadcrumb
            items={crumbs}
            ariaLabel="Breadcrumb"
            overflowAriaLabel="More links"
            dividerAs={_getCustomDivider}
          />
        </Stack.Item>

        <Stack.Item align="end">
          <FontIcon
            aria-label="FavoriteStarIcon"
            iconName="FavoriteStarIcon"
            className={iconClass}
          />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}
