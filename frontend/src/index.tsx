import React from 'react'
import { App } from './App'
import { Theme } from '@common'
import createStore from '@store'
import ReactDOM from 'react-dom/client'
import { StoreContext } from 'storeon/react'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { ConfigsProvider } from '@common/configs'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <StoreContext.Provider value={createStore()}>
        <ConfigsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigsProvider>
      </StoreContext.Provider>
    </ThemeProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
