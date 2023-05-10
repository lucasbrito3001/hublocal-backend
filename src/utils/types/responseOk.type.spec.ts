import { ResponseCreated, ResponseOk } from "./responseOk.type"

describe('Testing types', () => {
    describe('Response ok', () => {
        it('should return a complete response ok', () => {
            const response = new ResponseOk('ok', [1], { status: true })
            expect(response).toEqual({ statusCode: 200, message: 'ok', content: [1], extra: { status: true }  })
        })

        it('should return a response ok without extra', () => {
            const response = new ResponseOk('ok', [1])
            expect(response).toEqual({ statusCode: 200, message: 'ok', content: [1] })
        })

        it('should return a response ok without extra and content as an empty array', () => {
            const response = new ResponseOk('ok')
            expect(response).toEqual({ statusCode: 200, message: 'ok', content: [] })
        })
    })

    describe('Response created', () => {
        it('should return a complete response created', () => {
            const response = new ResponseCreated('Entity created')
            expect(response).toEqual({ statusCode: 201, message: 'Entity created' })
        })
    })
})