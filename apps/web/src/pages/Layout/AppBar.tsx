import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultPalette, IStackStyles, IStackTokens } from '@fluentui/react';

import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../logo.svg';
import { Image, IImageProps } from '@fluentui/react/lib/Image';

const imageProps: Partial<IImageProps> = {
  src: logo,
  styles: (props) => ({
    // root: { border: '1px solid ' + props.theme.palette.neutralSecondary },
    root: { paddingLeft: '4px', paddingRight: '4px' },
  }),
};

const AppBar: React.FunctionComponent = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [showSearchInput, setShowSearchInput] = useState(true);

  useEffect(() => {
    // console.log(`|${window.location.pathname}|`);
    if (window.location.pathname == '/') {
      setShowSearchInput(false);
    }
  }, []);

  function handleLandingClick() {
    navigate('/', { replace: true });
  }

  function handleRecipesClick() {
    navigate('/recipes', { replace: true });
  }

  const stackStyles: IStackStyles = {
    root: {
      // background: DefaultPalette.themeTertiary,
    },
  };

  const itemStyles: React.CSSProperties = {
    alignItems: 'center',
    // background: DefaultPalette.themePrimary,
    // color: DefaultPalette.white,
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    // width: 50,
  };

  const iconProps = { iconName: 'Search' };

  function handleLoginOnClick() {
    loginWithRedirect();
  }

  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin });
  }

  return (
    <Stack horizontal horizontalAlign="space-between" styles={stackStyles}>
      <span style={itemStyles}>
        {showSearchInput && (
          <>
            <Image {...imageProps} alt="4ks.io" height={36} />
            <TextField iconProps={iconProps} placeholder="Search" />
          </>
        )}
      </span>
      <span style={itemStyles}>
        {showSearchInput ? (
          <ActionButton onClick={handleLandingClick}>Search</ActionButton>
        ) : (
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
