import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { TodosService } from './todo.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('all')
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') todo_id: string) {
    return this.todosService.findOne(todo_id);
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') todo_id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(todo_id, dto);
  }

  @Delete(':id')
  delete(@Param('id') todo_id: string) {
    return this.todosService.delete(todo_id);
  }
}
