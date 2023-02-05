import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { IStackStyles } from '@fluentui/react/lib/Stack';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../logo.svg';
import { Image, IImageProps } from '@fluentui/react/lib/Image';
import { IconButton } from '@fluentui/react/lib/Button';
import {
  ContextualMenuItemType,
  IContextualMenuProps,
  IContextualMenuItem,
} from '@fluentui/react/lib/ContextualMenu';
import { useSessionContext } from '../../providers';

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

const AppBar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const location = useLocation();
  const [isTransition, setIsTransition] = useState(false);

  const [showLogo, setShowLogo] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showRecipesLink, setShowRecipesLink] = useState(true);

  useEffect(() => {
    if (location.pathname == '/') {
      setShowLogo(false);
      setShowSearchInput(false);
      setShowRecipesLink(true);
    } else if (['/new', '/login', '/logout'].includes(location.pathname)) {
      setShowLogo(true);
      setIsTransition(true);
      setShowRecipesLink(false);
      setShowSearchInput(false);
    } else {
      setShowLogo(true);
      setIsTransition(false);
      setShowRecipesLink(true);
      setShowSearchInput(true);
    }
  }, [location.pathname]);

  function handleLandingClick() {
    if (!isTransition) {
      navigate('/');
    }
  }

  function handleRecipesClick() {
    navigate('/r');
  }

  function handleLoginOnClick() {
    loginWithRedirect();
  }

  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin + '/logout' });
  }

  function handleSettingsClick() {
    navigate('/me');
  }

  function handleProfileClick() {
    navigate(`/${ctx.user?.username}`);
  }

  const logoutMenuItem: IContextualMenuItem = {
    key: 'logout',
    onClick: handleLogoutOnClick,
    iconProps: { iconName: 'StatusCircleErrorX' },
    text: 'Logout',
  };

  const transitionMenuProps: IContextualMenuProps = {
    shouldFocusOnMount: true,
    items: [logoutMenuItem],
  };

  const menuProps: IContextualMenuProps = {
    shouldFocusOnMount: true,
    items: [
      {
        key: 'profile',
        onClick: handleProfileClick,
        iconProps: { iconName: 'contact' },
        text: 'Profile',
      },
      {
        key: 'settings',
        onClick: handleSettingsClick,
        iconProps: { iconName: 'settings' },
        text: 'Settings',
      },
      { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
      logoutMenuItem,
    ],
  };

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

  return (
    <Stack horizontal horizontalAlign="space-between" styles={stackStyles}>
      <span style={itemStyles}>
        {showLogo && (
          <Image
            {...imageProps}
            alt="4ks.io"
            height={36}
            onClick={handleLandingClick}
          />
        )}
        {showSearchInput && <TextField placeholder="Search" />}
      </span>
      <span style={itemStyles}>
        {showRecipesLink && (
          <ActionButton onClick={handleRecipesClick}>Recipes</ActionButton>
        )}
        {isAuthenticated ? (
          <IconButton
            menuProps={isTransition ? transitionMenuProps : menuProps}
            iconProps={{ iconName: 'Contact' }}
            title="Options"
            ariaLabel="Options"
          />
        ) : (
          <ActionButton onClick={handleLoginOnClick}>Login</ActionButton>
        )}
      </span>
    </Stack>
  );
};

export default AppBar;
