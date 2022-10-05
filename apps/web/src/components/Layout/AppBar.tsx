import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultPalette, IStackStyles, IStackTokens } from '@fluentui/react';
import { usePageContext } from '../../renderer/usePageContext';

import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../assets/logo.svg';
import { Image, IImageProps } from '@fluentui/react/lib/Image';

const imageProps: Partial<IImageProps> = {
  src: logo,
  styles: (props) => ({
    // root: { border: '1px solid ' + props.theme.palette.neutralSecondary },
    root: {
      paddingLeft: '4px',
      paddingRight: '4px',
      // borderBottom: '1px solid rgb(200, 200, 200)',
    },
  }),
};

const AppBar: React.FunctionComponent = () => {
  const pageContext = usePageContext();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  // const navigate = useNavigate();

  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showRecipesLink, setShowRecipesLink] = useState(true);

  useEffect(() => {
    const pathname = pageContext.urlPathname;
    if (pathname == '/') {
      setShowSearchInput(false);
    } else if (pathname == '/recipes') {
      setShowRecipesLink(false);
    }
  }, [pageContext.urlPathname]);

  function handleLandingClick() {
    // navigate('/', { replace: true });
    if (window) {
      window.location.href = '/';
    }
  }

  function handleRecipesClick() {
    // navigate('/recipes', { replace: true });
    if (window) {
      window.location.href = '/recipes';
    }
  }

  const stackStyles: IStackStyles = {
    root: {
      // background: DefaultPalette.themeTertiary,
      borderBottom: '1px solid rgb(200, 200, 200)',
    },
  };

  const itemStyles: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 48,
    justifyContent: 'center',
  };

  function handleLoginOnClick() {
    loginWithRedirect();
  }

  function handleLogoutOnClick() {
    logout({ returnTo: pageContext.urlPathname });
  }

  return (
    <Stack horizontal horizontalAlign="space-between" styles={stackStyles}>
      <span style={itemStyles}>
        {showSearchInput && (
          <>
            <Image {...imageProps} alt="4ks.io" height={36} />
            <TextField placeholder="Search" />
          </>
        )}
      </span>
      <span style={itemStyles}>
        {showSearchInput && (
          <ActionButton onClick={handleLandingClick}>Search</ActionButton>
        )}
        {showRecipesLink && (
          <ActionButton onClick={handleRecipesClick}>Recipes</ActionButton>
        )}
        {isAuthenticated ? (
          <ActionButton onClick={handleLogoutOnClick}>Logout</ActionButton>
        ) : (
          <ActionButton onClick={handleLoginOnClick}>Login</ActionButton>
        )}
      </span>
    </Stack>
  );
};

export default AppBar;
