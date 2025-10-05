import { IsString, IsIn, IsOptional, IsNumber, isString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  instructions: string;

  @IsIn(['strict', 'loose'])
  mode: 'strict' | 'loose';

  @IsNumber()
  @IsOptional()
  minWords?: number;



}
