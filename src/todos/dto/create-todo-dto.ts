import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Faire les courses',
    description: 'Le titre du todo',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Acheter du lait et du pain',
    description: 'Description optionnelle du todo',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Statut du todo (terminé ou non)',
    default: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
