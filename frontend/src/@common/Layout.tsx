import { useHistory } from 'react-router-dom'
import AppsIcon from '@mui/icons-material/Apps'
import React, { ReactNode, useState } from 'react'
import ForwardIcon from '@mui/icons-material/Forward'
import ViewListIcon from '@mui/icons-material/ViewList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Link,
  List,
  Grid,
  Drawer,
  Tooltip,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

export interface LayoutProps {
  children: ReactNode
}

const classes = {
  layout: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    '& svg': {
      fontSize: '48px',
    },
  },
  notificationsBtn: {
    width: '48px',
    height: '48px',
    '& svg': {
      fontSize: '32px',
    },
  },
  nav: {
    width: '100%',
    justifyContent: 'right',
  },
  content: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDrawerList: {
    minWidth: '240px',
  },
}

export function Layout({ children }: LayoutProps) {
  const history = useHistory()

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <Drawer anchor='right' open={menuOpen} data-cy='menu-drawer' onClose={toggleDrawer}>
        <List sx={classes.menuDrawerList}>
          <ListItem
            button
            data-cy='my-games-button'
            onClick={() => history.push('/my-games')}
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary='My Games' />
          </ListItem>
          <ListItem
            button
            data-cy='logout-button'
            onClick={() => history.push('/logout')}
          >
            <ListItemIcon>
              <ForwardIcon />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </Drawer>
      <Grid display='flex' direction='column' sx={classes.layout}>
        <Grid item display='flex' sx={classes.nav} alignItems='center'>
            <IconButton
              aria-label='menu'
              sx={classes.notificationsBtn}
              data-cy='notifications-button'
            >
              <NotificationsIcon fontSize='inherit' />
            </IconButton>
          <Tooltip id='menu-button-tooltip' title='menu'>
            <IconButton
              aria-label='menu'
              sx={classes.btn}
              data-cy='menu-button'
              onClick={toggleDrawer}
            >
              <AppsIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item display='flex' sx={classes.content}>
          {children}
        </Grid>
      </Grid>
    </>
  )
}
