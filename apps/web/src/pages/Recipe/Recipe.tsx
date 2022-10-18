import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { PageLayout } from '../Layout';
import { RecipeHeader } from './RecipeHeader';
import { RecipeControls } from './RecipeControls';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeContentView } from './Views/RecipeContent';
import { RecipeCommentsView } from './Views/RecipeComments';
import { RecipeVersionsView } from './Views/RecipeVersions';
import { RecipeStoryView } from './Views/RecipeStory';
import { RecipeSettingsView } from './Views/RecipeSettings';
import { RecipeForksView } from './Views/RecipeForks';
import { RecipeViews } from './RecipeControls';
import { useRecipeContext } from '../../providers/recipe-context';

type RecipeProps = {
  create?: boolean;
};

const Recipe = ({ create = false }: RecipeProps) => {
  const [selectedView, setSelectedView] = useState(RecipeViews.RecipeContent);

  return (
    <PageLayout>
      <Stack
        styles={stackStyles}
        tokens={itemAlignmentsStackTokens}
        id="target"
      >
        <RecipeHeader />
        <RecipeControls setSelectedView={setSelectedView} />

        {selectedView == RecipeViews.RecipeContent && (
          <RecipeContentView create={create} />
        )}
        {selectedView == RecipeViews.Forks && <RecipeForksView />}
        {/* {selectedView == RecipeViews.Comments && <RecipeCommentsView />} */}
        {/* {selectedView == RecipeViews.Story && <RecipeStoryView />} */}
        {selectedView == RecipeViews.Versions && <RecipeVersionsView />}
        {selectedView == RecipeViews.Settings && <RecipeSettingsView />}
      </Stack>
    </PageLayout>
  );
};

export default Recipe;
