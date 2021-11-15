import React from 'react'
import { App } from './App'
import ReactDOM from 'react-dom'
import createStore from '@store'
import { StoreContext } from 'storeon/react'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { ConfigsProvider } from '@common/configs'

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={createStore()}>
      <ConfigsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigsProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
