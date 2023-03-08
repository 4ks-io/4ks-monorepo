import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import { IStackStyles } from '@fluentui/react/lib/Stack';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../logo.svg';
import { useSessionContext } from '../../providers';
import {
  InstantSearch,
  SearchBox,
  useHits,
} from 'react-instantsearch-hooks-web';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const AppBar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const ctx = useSessionContext();

  const location = useLocation();
  const [isTransition, setIsTransition] = useState(false);

  const [showLogo, setShowLogo] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showRecipesLink, setShowRecipesLink] = useState(true);
  const [searchHits, setSearchHits] = useState<any>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

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
    setAnchorEl(null);
  }

  function handleSettingsClick() {
    navigate('/me');
    setAnchorEl(null);
  }

  function handleProfileClick() {
    navigate(`/${ctx.user?.username}`);
    setAnchorEl(null);
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

  function ProfileMenu() {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {!isTransition && (
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
        )}
        {!isTransition && (
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}
        {!isTransition && <Divider />}
        <MenuItem onClick={handleLogoutOnClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    );
  }

  return (
    <Stack horizontal horizontalAlign="space-between" styles={stackStyles}>
      <span style={itemStyles}>
        {showLogo && (
          <Box
            component="img"
            sx={{
              height: 36,
              paddingRight: 1,
            }}
            alt="4ks.io"
            src={logo}
            onClick={handleLandingClick}
          />
        )}
        {showSearchInput && <SearchBox placeholder="Search . . ." />}
      </span>
      <span style={itemStyles}>
        {showRecipesLink && (
          <Button onClick={handleRecipesClick}>Recipes</Button>
        )}
        {isAuthenticated ? (
          <>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                {ctx.user?.username ? (
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {ctx.user?.username.substring(0, 1)}
                  </Avatar>
                ) : (
                  <Avatar />
                )}
              </IconButton>
            </Tooltip>
            <ProfileMenu />
          </>
        ) : (
          <Button onClick={handleLoginOnClick}>Login</Button>
        )}
      </span>
    </Stack>
  );
};

export default AppBar;
