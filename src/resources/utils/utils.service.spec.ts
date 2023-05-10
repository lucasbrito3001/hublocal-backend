import { Request } from "express"
import { UtilsService } from "./utils.service"

describe('Testing utils service', () => {
    const utilsService = new UtilsService()

    describe('Testing token service', () => {
    
        it('should extract the token from request header and return succesfully', () => {
            const request = { headers: { authorization: 'Bearer some-token' }} as any as Request
            const token = utilsService.getAuthorizationToken(request)
    
            expect(token).toBe('some-token')
        })
    
        it('should return undefined when the request dont have the token', () => {
            const request = { headers: {}} as any as Request
            const token = utilsService.getAuthorizationToken(request)
    
            expect(token).toBe(undefined)
        })
    
        it('should return undefined when the request dont have the word Bearer in the authorization token', () => {
            const request = { headers: { authorization: ' some-token' }} as any as Request
            const token = utilsService.getAuthorizationToken(request)
    
            expect(token).toBe(undefined)
        })
    })
    
    describe('Testing clear number string', () => {
        it('should clear number string successfully', () => {
            const cleanedString = utilsService.clearNumberString('123.+=123-123/123%%$$#')

            expect(cleanedString).toBe('123123123123')
        })

        it('should return undefined when receive a parameter with type different of string', () => {
            const cleanedString = utilsService.clearNumberString(123456 as any as string)

            expect(cleanedString).toBe(undefined)
        })
    })
})