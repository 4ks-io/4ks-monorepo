import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConst, useBoolean } from '@fluentui/react-hooks';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultPalette, IStackStyles, IStackTokens } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../logo.svg';
import { Callout } from '@fluentui/react/lib/Callout';
import { Image, IImageProps } from '@fluentui/react/lib/Image';
// import { Panel } from '@fluentui/react/lib/Panel';
import { DefaultButton } from '@fluentui/react/lib/Button';
import {
  ContextualMenuItemType,
  IContextualMenuProps,
  IContextualMenuItemProps,
} from '@fluentui/react/lib/ContextualMenu';

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
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showRecipesLink, setShowRecipesLink] = useState(true);

  const menuProps: IContextualMenuProps = useConst({
    shouldFocusOnMount: true,
    items: [
      {
        key: 'profile',
        onClick: handleSettingsClick,
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
      {
        key: 'logout',
        iconProps: { iconName: 'StatusCircleErrorX' },
        text: 'Logout',
      },
    ],
  });

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname == '/') {
      setShowSearchInput(false);
    } else if (pathname == '/r') {
      setShowRecipesLink(false);
    }
  }, [window.location.pathname]);

  function handleLandingClick() {
    navigate('/', { replace: true });
  }

  function handleRecipesClick() {
    navigate('/r', { replace: true });
  }

  function handleLoginOnClick() {
    loginWithRedirect();
  }

  function handleLogoutOnClick() {
    logout({ returnTo: window.location.origin + '/logout' });
  }
  function handleSettingsClick() {
    navigate('/me', { replace: true });
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

  return (
    <Stack horizontal horizontalAlign="space-between" styles={stackStyles}>
      <span style={itemStyles}>
        {showSearchInput && (
          <>
            <Image
              {...imageProps}
              alt="4ks.io"
              height={36}
              onClick={handleLandingClick}
            />
            <TextField placeholder="Search" />
          </>
        )}
      </span>
      <span style={itemStyles}>
        {/* {showSearchInput && (
          <ActionButton onClick={handleLandingClick}>Home</ActionButton>
        )} */}
        {showRecipesLink && (
          <ActionButton onClick={handleRecipesClick}>Recipes</ActionButton>
        )}
        {isAuthenticated ? (
          <>
            {/* <Panel
              headerText="Options"
              isOpen={isOpen}
              onDismiss={dismissPanel}
              // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
              closeButtonAriaLabel="Close"
            >
              <DefaultButton onClick={handleSettingsClick} text="Settings" />
              <DefaultButton onClick={handleLogoutOnClick} text="Logout" />
            </Panel> */}
            <DefaultButton menuProps={menuProps}>
              <Icon iconName="Contact" onClick={openPanel} />
            </DefaultButton>
          </>
        ) : (
          <ActionButton onClick={handleLoginOnClick}>Login</ActionButton>
        )}
      </span>
    </Stack>
  );
};

export default AppBar;
