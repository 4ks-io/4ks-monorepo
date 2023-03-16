import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSessionContext } from '../../providers';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import logo from '../../logo.svg';
import { Theme, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function MainAppBar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const ctx = useSessionContext();
  const theme = useTheme();

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
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
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
        {showSearchInput && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {showRecipesLink && (
          <Button sx={AppBarButtonStyles(theme)} onClick={handleRecipesClick}>
            Recipes
          </Button>
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
