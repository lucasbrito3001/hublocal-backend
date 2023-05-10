import { BadRequestException, ConflictException } from "@nestjs/common";

export class InvalidCnpjException extends BadRequestException {
    constructor() {
        super('Invalid cnpj')
    }
}

export class SchemaValidationFailedException extends BadRequestException {
    constructor() {
        super('The request body data contains missing or invalid data, check and try again')
    }
}

export class DuplicatedUniqueKeyException extends ConflictException {
    constructor(entity: string, uniqueKey: string) {
        super(`Already exists a ${entity} with this ${uniqueKey}`)
    }
}

export class MissingRequiredInformationException extends BadRequestException {
    constructor(action: string) {
        super(`There was an error ${action}, required information is missing`)
    }
}

export class EntityNotFoundException extends BadRequestException {
    constructor(entity: string, action: string) {
        super(`Could not ${action} because the ${entity} was not found`)
    }
}

export class ImposibleDeleteByRelationException extends ConflictException {
    constructor() {
        super("This item can't be deleted because it still has active relationships")
    }
}