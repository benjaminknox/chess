import { useHistory } from 'react-router-dom'
import AppsIcon from '@mui/icons-material/Apps'
import React, { ReactNode, useState } from 'react'
import ForwardIcon from '@mui/icons-material/Forward'
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
        <Grid item display='flex' sx={classes.nav}>
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
