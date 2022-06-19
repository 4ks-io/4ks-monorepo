import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnimationClassNames,
  mergeStyles,
  getTheme,
} from '@fluentui/react/lib/Styling';
import {
  ActionButton,
  Stack,
  Layer,
  Image,
  ImageFit,
  TextField,
  Toggle,
} from '@fluentui/react';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
} from '@fluentui/react/lib/DocumentCard';
import { useAuth0 } from '@auth0/auth0-react';
import { useSessionContext } from '../../providers/session-context';
import { models_Recipe } from '@4ks/api-fetch';

const Home: React.FunctionComponent = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<models_Recipe[] | undefined>();

  useEffect(() => {
    if (ctx?.api) {
      ctx.api.recipes.getRecipes().then((r) => {
        setRecipes(r);
      });
    }
  }, [ctx]);

  function handleLandingClick() {
    navigate('/', { replace: true });
  }

  const content = (
    <div className={contentClass}>
      4ks.io
      {isAuthenticated ? (
        <ActionButton onClick={handleLogoutOnClick}>Logout</ActionButton>
      ) : (
        <ActionButton onClick={handleLoginOnClick}>Login</ActionButton>
      )}
      <ActionButton onClick={handleLandingClick}>Landing</ActionButton>
    </div>
  );

  function handleLoginOnClick() {
    loginWithRedirect();
  }
  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin });
  }

  return (
    <div style={{ marginTop: '48px' }}>
      <Layer>{content}</Layer>
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        style={{ width: '100%', rowGap: 10 }}
      >
        <>
          {JSON.stringify(recipes)}
          {/* {recipes &&
            recipes.map((r) => {
              <DocumentCard
                key={r.id}
                aria-label="Default Document Card with large file name. Created by Annie Lindqvist a few minutes ago."
                onClickHref="http://bing.com"
              >
                <DocumentCardTitle
                  title={
                    'Large_file_name_with_underscores_used_to_separate_all_of_the_words_and_there_are_so_many_words_' +
                    'it_needs_truncating.pptx'
                  }
                  shouldTruncate
                />
              </DocumentCard>;
            })} */}
        </>
      </Stack>
    </div>
  );
};

const theme = getTheme();
const contentClass = mergeStyles([
  {
    backgroundColor: theme.palette.themePrimary,
    color: theme.palette.white,
    lineHeight: '48px',
    padding: '0 20px',
  },
  AnimationClassNames.scaleUpIn100,
]);

export default Home;
