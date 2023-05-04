import { ApiProperty } from "@nestjs/swagger"

export class AuthUserDto {
    @ApiProperty()
    email: string

    @ApiProperty()
    password: string
}
