import { IsNotEmpty, IsString, IsOptional, IsMongoId } from "class-validator"

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @IsMongoId()
  parentComment?: string
}

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string
}
