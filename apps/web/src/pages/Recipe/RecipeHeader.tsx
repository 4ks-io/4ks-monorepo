import React from 'react';
import { Stack } from '@fluentui/react';
import {
  Breadcrumb,
  IBreadcrumbItem,
  IDividerAsProps,
} from '@fluentui/react/lib/Breadcrumb';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { useRecipeContext } from '../../providers/recipe-context';
import { PrimaryButton } from '@fluentui/react/lib/Button';

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

interface RecipeHeaderProps {}

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();

  const crumbs: IBreadcrumbItem[] = [
    {
      text: rtx?.recipe?.author?.displayName || '',
      key: 'author',
      onClick: () => {},
    },
    {
      text: rtx?.recipe?.currentRevision?.name || '',
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
      </Stack>
      <Stack horizontal horizontalAlign="space-evenly">
        <Stack.Item align="end">
          <PrimaryButton
            iconProps={{ iconName: 'BranchFork2' }}
            text="Fork"
            onClick={_alertFork}
          />
        </Stack.Item>
        <Stack.Item align="end">
          <PrimaryButton
            iconProps={{ iconName: 'FavoriteStar' }}
            text="Star"
            onClick={_alertStar}
          />
        </Stack.Item>
        <Stack.Item align="end">
          <PrimaryButton
            iconProps={{ iconName: 'SocialListeningLogo' }}
            text="Share"
            onClick={_alertShare}
          />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}

function _alertFork() {
  alert('Fork!');
}

function _alertStar() {
  alert('Star!');
}

function _alertShare() {
  alert('Share!');
}
