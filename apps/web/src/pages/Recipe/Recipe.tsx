import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { PageLayout } from '../Layout';
import { RecipeHeader } from './RecipeHeader';
import { RecipeControls } from './RecipeControls';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { RecipeContentView } from './Views/RecipeContent';
import { RecipeCommentsView } from './Views/RecipeComments';
import { RecipeStoryView } from './Views/RecipeStory';
import { RecipeForksView } from './Views/RecipeForks';
import { RecipeViews } from './RecipeControls';

type RecipeProps = {
  create?: boolean;
};

const Recipe = ({ create }: RecipeProps) => {
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
        {selectedView == RecipeViews.Comments && <RecipeCommentsView />}
        {selectedView == RecipeViews.Story && <RecipeStoryView />}
      </Stack>
    </PageLayout>
  );
};

export default Recipe;
