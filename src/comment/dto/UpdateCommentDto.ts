import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateCommentDto {
   @ApiProperty()
   @IsNotEmpty() 
   readonly content: string;
   @ApiProperty()
   @IsNotEmpty()    
   readonly postId: number;
}