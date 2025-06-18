import { IsOptional, IsBooleanString, IsString, IsInt, Min, IsMongoId } from 'class-validator';

export class SearchTodoDto {
  @IsOptional()
  @IsBooleanString()
  status?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsMongoId()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}