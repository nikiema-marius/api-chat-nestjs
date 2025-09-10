import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePostDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly title?: string;
    @ApiProperty()
    @IsNotEmpty()
    readonly body?: string;
}