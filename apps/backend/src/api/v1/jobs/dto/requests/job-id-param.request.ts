import { IsUUID } from 'class-validator';

export class JobIdParamRequestDto {
  @IsUUID('4')
  id!: string;
}
