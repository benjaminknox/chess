import { Andada, Epilogue } from '@fonts'
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
  fallbacks: [...Andada, ...Epilogue],
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
      styleOverrides: css,
    },
  },
  typography: {
    fontFamily: 'Epilogue',
    ...Object.fromEntries(
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(key => [
        key,
        {
          fontFamily: 'Andada',
        },
      ])
    ),
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
