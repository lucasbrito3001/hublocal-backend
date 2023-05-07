import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectSchema } from "joi";
import { SchemaValidationFailedException } from "src/utils/custom/exceptions.custom";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) { }

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value)

        if(error) throw new SchemaValidationFailedException()

        return value
    }
}