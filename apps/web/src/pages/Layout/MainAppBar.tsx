import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSearchContext, useSessionContext } from '../../providers';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import logo from '../../logo.svg';
import { Theme, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export default function MainAppBar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const search = useSearchContext();
  const theme = useTheme();

  const location = useLocation();
  const [isTransition, setIsTransition] = useState(false);

  const [showLogo, setShowLogo] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showExploreLink, setShowExploreLink] = useState(true);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (location.pathname == '/') {
      setShowLogo(false);
      setShowSearchInput(false);
      setShowExploreLink(true);
    } else if (['/new', '/login', '/logout'].includes(location.pathname)) {
      setShowLogo(true);
      setIsTransition(true);
      setShowExploreLink(false);
      setShowSearchInput(false);
    } else {
      setShowLogo(true);
      setIsTransition(false);
      setShowExploreLink(false);
      setShowSearchInput(true);
    }
  }, [location.pathname]);

  function handleOpenSearch() {
    search.handleOpen();
  }

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

  function handleExploreClick() {
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
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}
        {!isTransition && <Divider />}
        <MenuItem onClick={handleLogoutOnClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    );
  }

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
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

        <Box sx={{ flexGrow: 1 }} />

        {showSearchInput && (
          <TextField
            id="searchBox"
            size="small"
            placeholder="Search..."
            onClick={handleOpenSearch}
            sx={{ width: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label="Ctrl+K" />
                </InputAdornment>
              ),
            }}
          />
        )}

        {showExploreLink && (
          <Tooltip title="Explore">
            <IconButton aria-label="explore" size="large">
              <ExploreIcon fontSize="inherit" onClick={handleExploreClick} />
            </IconButton>
          </Tooltip>
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
          <Button sx={AppBarButtonStyles(theme)} onClick={handleLoginOnClick}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

const AppBarButtonStyles = (theme: Theme) => {
  return {
    my: 2,
    color: theme.palette.primary.dark,
    display: 'block',
  };
};
