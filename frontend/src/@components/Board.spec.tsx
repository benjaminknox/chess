import Chess from 'chess.js'
import * as React from 'react'
import { mount } from '@cypress/react'
import { PlayerCard } from './PlayerCard'
import { Board, BoardProps } from './Board'

describe('Board', () => {
  beforeEach(() => {
    cy.viewport(800, 800)
  })

  it('shows board in start position', () => {
    mount(<TestBoardContainer />)
    cy.get('[data-square-color=white]').should('exist')
  })

  it('fires board move event', () => {
    let sourceSquare: any
    let targetSquare: any
    let piece: any

    const move = cy.spy(
      (_sourceSquare: string, _targetSquare: string, _piece: string) => {
        sourceSquare = _sourceSquare
        targetSquare = _targetSquare
        piece = _piece

        return true
      }
    )

    mount(<TestBoardContainer move={move} />)

    cy.get('[data-square=g2] div[draggable=true]').then($draggable => {
      cy.get('[data-square=g4]').then($droppable => {
        const dataTransfer = { dataTransfer: new DataTransfer() }

        cy.wrap($draggable).trigger('dragstart', dataTransfer)
        cy.wrap($droppable)
          .trigger('drop', dataTransfer)
          .then(() => {
            //@ts-ignore
            expect(move).to.be.calledOnce
            expect(sourceSquare).to.equal('g2')
            expect(targetSquare).to.equal('g4')
            expect(piece).to.equal('wP')
          })
      })
    })
  })

  function TestBoardContainer(props: Partial<BoardProps>) {
    const defaultProps = {
      chess: new Chess(),
      move: cy.stub(),
      blackPlayer: <PlayerCard name='test-player-black' align='right' />,
      whitePlayer: <PlayerCard name='test-player-white' />,
      ...props,
    }

    return <Board {...defaultProps} />
  }
})
