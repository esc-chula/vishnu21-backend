import {
  IsByteLength,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class EmergencyDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsPhoneNumber('TH')
  @IsNotEmpty()
  @IsByteLength(10)
  phone: string;

  @IsString()
  @IsOptional()
  remark?: string;
}

