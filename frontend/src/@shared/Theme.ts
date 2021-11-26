import { createTheme } from '@mui/material/styles'

const coolers = {
  gunmetal: '#223843',
  cultured: '#EFF1F3',
  lightGray: '#DBD3D8',
  desertSand: '#D8B4A0',
  terraCotta: '#D77A61',
}

const colorScheme = {
  darkest: coolers.gunmetal,
  lightest: coolers.cultured,
  highlight: coolers.lightGray,
  secondary: coolers.desertSand,
  primary: coolers.terraCotta,
}

const css = {
  'html,body,#root': {
    margin: '0',
    padding: '0',
    height: '100%',
    background: colorScheme.lightest,
    color: colorScheme.darkest,
  },
}

const Theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: css
    },
  },
  palette: {
    primary: {
      main: colorScheme.primary,
    },
    secondary: {
      main: colorScheme.secondary,
    },
  },
})

export { coolers, colorScheme, Theme }
