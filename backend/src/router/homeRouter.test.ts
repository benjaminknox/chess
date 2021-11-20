import app from 'app'
import request from 'supertest'

describe('homeRouter', () => {
  describe('when calling home route', () => {
    it('shows chess emoji icon', async () => {
      const response = await request(app.callback()).get('/')
      expect(response.status).toBe(200)
      expect(response.text).toBe('{"🦸" :" ♚ ♛ ♜ ♝ ♞ ♟", "🤸":"♔ ♕ ♖ ♗ ♘ ♙"}')
    })
  })
})
