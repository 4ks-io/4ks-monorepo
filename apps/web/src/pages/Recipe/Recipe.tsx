import React, { useEffect, useState } from 'react';
import {
  Stack,
  IStackProps,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import {
  Breadcrumb,
  IBreadcrumbItem,
  IDividerAsProps,
} from '@fluentui/react/lib/Breadcrumb';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

import { DefaultPalette } from '@fluentui/react';
import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';
import { PageLayout } from '../Layout';
import { formatDate } from '../../utils/dateTime';

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

const stackStyles: IStackStyles = {
  root: {
    // background: DefaultPalette.themeTertiary,
  },
};

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

const stackItemStyles: IStackItemStyles = {
  root: {
    background: DefaultPalette.themePrimary,
    color: DefaultPalette.white,
    padding: 5,
  },
};

const Recipe: React.FunctionComponent = () => {
  const ctx = useSessionContext();
  const [recipeId, setRecipeId] = useState<string | undefined>();

  useEffect(() => {
    setRecipeId(window.location.href.split('/').pop());
  }, []);

  const [recipe, setRecipe] = useState<models_Recipe | undefined>();

  useEffect(() => {
    if (ctx?.api && recipeId) {
      ctx.api.recipes.getRecipes1(recipeId).then((r) => {
        console.log(r);
        setRecipe(r);
      });
    }
  }, [ctx, recipeId]);

  if (!recipe) {
    const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };
    const tokens = {
      sectionStack: {
        childrenGap: 10,
      },
      spinnerStack: {
        childrenGap: 20,
      },
    };

    return (
      <Stack {...rowProps} tokens={tokens.spinnerStack}>
        <Spinner size={SpinnerSize.large} />
      </Stack>
    );
  }

  // function _onBreadcrumbItemClicked(
  //   ev: React.MouseEvent<HTMLElement>,
  //   item: IBreadcrumbItem
  // ): void {
  //   console.log(`Breadcrumb item with key "${item.key}" clicked.`);
  // }

  {
    /* {recipe.author?.displayName} / {recipe.currentRevision?.name} */
  }

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
    <PageLayout>
      <span>
        <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
          <Stack.Item align="stretch">
            <Breadcrumb
              items={crumbs}
              ariaLabel="Breadcrumb"
              overflowAriaLabel="More links"
              dividerAs={_getCustomDivider}
            />
          </Stack.Item>
          <Stack.Item align="end">
            {recipe.updatedDate && formatDate(recipe.updatedDate)}
          </Stack.Item>

          <Stack.Item align="start" styles={stackItemStyles}>
            <span>Summary KPIs</span>
          </Stack.Item>
          <Stack.Item align="stretch" styles={stackItemStyles}>
            <span>Ingredients</span>
          </Stack.Item>
          <Stack.Item align="baseline" styles={stackItemStyles}>
            <span>Instructions</span>
          </Stack.Item>
          {recipe.currentRevision?.instructions?.map((i) => {
            return (
              <Stack.Item key={i.name} align="start" styles={stackItemStyles}>
                <span>
                  <>
                    {i.name} - {i.text}
                  </>
                </span>
              </Stack.Item>
            );
          })}
          {/* <Stack.Item align="center" styles={stackItemStyles}>
            <span>Center-aligned item</span>
          </Stack.Item>
          <Stack.Item align="end" styles={stackItemStyles}>
            <span>End-aligned item</span>
          </Stack.Item> */}
          <Stack.Item align="center" styles={stackItemStyles}>
            <span>
              <>Contributors</>
            </span>
          </Stack.Item>
          {recipe.contributors?.map((c) => {
            return (
              <Stack.Item key={c.id} align="center" styles={stackItemStyles}>
                <span>{c.displayName}</span>
              </Stack.Item>
            );
          })}
        </Stack>
      </span>
    </PageLayout>
  );
};

export default Recipe;
