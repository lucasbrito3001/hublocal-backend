import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";

export class CreateLocationDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    zipCode: string

    @ApiProperty()
    street: string

    @ApiProperty()
    number: number

    @ApiProperty()
    district: string

    @ApiProperty()
    city: string

    @ApiProperty()
    state: string

    @ApiProperty()
    companyId: number
}

export const createLocationSchema = Joi.object({
    name: Joi.string().required(),
    zipCode: Joi.string().required().regex(/^\d{5}-?\d{3}$/),
    street: Joi.string().required(),
    number: Joi.number().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required().length(2),
    companyId: Joi.number().required()
})