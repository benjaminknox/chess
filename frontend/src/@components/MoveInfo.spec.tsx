import Chess from 'chess.js'
import * as React from 'react'
import { MoveInfo } from './MoveInfo'
import { mount } from '@cypress/react'

describe('MoveInfo', () => {
  it('should show white when passed FEN with turn of white', () => {
    mount(
      <MoveInfo
        board={new Chess('rnbqkbnr/pppp1ppp/4p3/8/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 2')}
      />
    )
    cy.get('[data-cy=white-move]')
  })
  it('should show black when passed FEN with turn of black', () => {
    mount(
      <MoveInfo
        board={new Chess('rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1')}
      />
    )
    cy.get('[data-cy=black-move]')
  })
})
