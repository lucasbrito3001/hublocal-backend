export class ResponseCreated {
    public statusCode = 201
    public message: string

    constructor(message: string) {
        this.message = message
    }
}

export class ResponseOk {
    public statusCode = 200
    public message: string
    public content?: any[]
    public extra?: any

    constructor(message: string, content?: any[], extra?: any) {
        this.message = message
        this.content = content || []
        this.extra = extra || undefined
    }
}