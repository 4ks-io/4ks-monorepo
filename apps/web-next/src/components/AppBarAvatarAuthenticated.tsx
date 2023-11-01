'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

type AppBarAvatarAuthenticatedProps = {
  username: string;
};

export default function AppBarAvatarAuthenticated({
  username,
}: AppBarAvatarAuthenticatedProps) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleProfileClick() {
    router.push(`/${username}`);
    setAnchorEl(null);
  }

  function handleSettingsClick() {
    router.push('/settings');
    setAnchorEl(null);
  }

  function handleLogoutOnClick() {
    router.push('/app/auth/logout');
    setAnchorEl(null);
  }

  function ProfileMenu() {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        {/* {!isTransition && <Divider />} */}
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
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleMenuOpen}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            {username.substring(0, 1)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <ProfileMenu />
    </>
  );
}
