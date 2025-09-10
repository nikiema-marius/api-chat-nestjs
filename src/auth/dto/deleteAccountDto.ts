import { IsNotEmpty } from "class-validator";

export class deleteAccountDto {
    @IsNotEmpty()
    readonly password: string;
}
