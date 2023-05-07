import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";

export class FindAllParams {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    companyId?: number
}