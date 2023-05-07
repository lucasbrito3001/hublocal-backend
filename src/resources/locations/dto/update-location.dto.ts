import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import * as Joi from 'joi';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

export const updateLocationSchema = Joi.object({
    name: Joi.string(),
    zipCode: Joi.string().regex(/^\d{8}$/),
    street: Joi.string(),
    number: Joi.number(),
    district: Joi.string(),
    city: Joi.string(),
    state: Joi.string().length(2),
    companyId: Joi.number().required()
})