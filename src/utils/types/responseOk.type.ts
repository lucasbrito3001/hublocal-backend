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

    constructor(message: string, content?: any[]) {
        this.message = message
        this.content = content
    }
}