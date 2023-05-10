import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";

export class FindAllParams {
    @ApiProperty()
    @IsNumberString()
    companyId: number

    @ApiProperty()
    @IsNumberString()
    page: number

    @ApiProperty()
    @IsNumberString()
    rowsPerPage: number
}