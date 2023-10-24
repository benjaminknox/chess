import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { LoginFormContainer } from '@pages/auth/LoginFormContainer'
import { MyGames, Home, SelectOpponent, SelectSide, Game } from '@pages'

export function App() {
  const { dispatch } = useStoreon('Auth')

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute component={() => <Home />} />} />
      <Route
        path='/new-game/select-opponent'
        element={<ProtectedRoute component={() => <SelectOpponent />} />}
      />
      <Route
        path='/my-games'
        element={<ProtectedRoute component={() => <MyGames />} />}
      />
      <Route path={'/game/:id'} element={<ProtectedRoute component={() => <Game />} />} />
      <Route
        path={'/new-game/:uid/select-side'}
        element={<ProtectedRoute component={() => <SelectSide />} />}
      />
      <Route
        path={'/logout'}
        element={
          <ProtectedRoute
            component={() => {
              dispatch('auth/resetIdentity')
              return <Navigate to='/login' />
            }}
          />
        }
      />
      <Route path={'/login'} Component={LoginFormContainer} />
    </Routes>
  )
}
