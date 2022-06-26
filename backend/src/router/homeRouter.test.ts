import app from 'app'
import axios from 'axios'
import request from 'supertest'

jest.mock('axios')

describe('homeRouter', () => {
  describe('when calling home route', () => {
    it('shows chess emoji icon', async () => {

      //@ts-ignore
      axios.mockImplementation(request =>
        Promise.resolve({
          data: request.url === 'http://test-client/validate' ? { sub: 'player1' } : {},
        })
      )

      const response = await request(app().callback()).get('/api')
      expect(response.status).toBe(200)
      expect(response.text).toBe('{"🦸" :" ♚ ♛ ♜ ♝ ♞ ♟", "🤸":"♔ ♕ ♖ ♗ ♘ ♙"}')
    })
  })
})
