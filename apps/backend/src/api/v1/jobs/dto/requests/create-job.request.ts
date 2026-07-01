import { ApiProperty } from '@nestjs/swagger';
import type { CreateJobRequest } from '@url-checker/contracts';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsUrl } from 'class-validator';

export class CreateJobRequestDto implements CreateJobRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] }, { each: true })
  @ApiProperty({
    example: [
      'https://example.com',
      'https://google.com',
      'https://github.com',
      'https://stackoverflow.com',
      'https://npmjs.com',
      'https://nodejs.org',
      'https://nestjs.com',
      'https://react.dev',
      'https://vite.dev',
      'https://www.typescriptlang.org',
      'https://httpbin.org/status/200',
      'https://httpbin.org/status/201',
      'https://httpbin.org/status/204',
      'https://httpbin.org/status/400',
      'https://httpbin.org/status/404',
      'https://httpbin.org/status/500',
    ],
  })
  urls!: string[];
}
