import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {useRoutes, useRedirect} from 'hookrouter';

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';

import { GoogleLogout } from 'react-google-login';
import axios from 'axios';

const items = [
  {
    href: '/profile',
    icon: UserIcon,
    title: 'Profile'
  },
  {
    href: '/discover',
    icon: UsersIcon,
    title: 'Discover'
  },
  {
    href: '/admin',
    icon: UserPlusIcon,
    title: 'Admin'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  name: {
    paddingTop: 10
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const logOut = cookies => {
  axios
    .post('/api/v1/auth/logout', {
      withCredentials: true
    })
    .then(response => {
      cookies.cookies.remove('isLoggedIn', { path: '/' });
      cookies.cookies.remove('userData', { path: '/' });
      window.location.href = '/';
    })
    .catch(err => {
      console.log(err);
    });
};

const NavBar = ({ user, cookies, onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.image}
          to="/app/account"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => {
            if (item.title === 'Profile' && user.role === 'visitor')
              return null;
            if (
              item.title === 'Admin' &&
              user.role !== 'admin' &&
              user.role !== 'superAdmin'
            )
              return null;

            return (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            );
          })}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box p={2} m={2}>
        <Box display="flex" justifyContent="center" mt={2}>
          <GoogleLogout
            clientId="1092979243632-ufl3842hjal4adoaio73ta2noj2avnbo.apps.googleusercontent.com"
            buttonText="LOG OUT"
            onLogoutSuccess={() => logOut({ cookies })}
            theme="dark"
            icon={false}
          ></GoogleLogout>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
