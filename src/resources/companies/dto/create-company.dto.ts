import { ApiProperty } from "@nestjs/swagger"

export class CreateCompanyDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    website: string

    @ApiProperty()
    cnpj: string
}
