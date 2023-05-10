import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class FindAllParams {
    @ApiProperty()
    @IsNumberString()
    page: number

    @ApiProperty()
    @IsNumberString()
    rowsPerPage: number
}