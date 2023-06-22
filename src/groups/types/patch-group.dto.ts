import {
  IsByteLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class PatchGroupDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly longName: string;
  
  @IsString()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly profile: string;

  @IsString()
  @IsOptional()
  readonly score?: number;
}
