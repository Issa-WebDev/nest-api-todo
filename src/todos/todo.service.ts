import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.todo.findMany();
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(todo_id: string) {
    try {
      return await this.prisma.todo.findUnique({ where: { todo_id } });
    } catch (error) {
      console.log(error);
    }
  }

  async create(createTodo: CreateTodoDto) {
    try {
      return await this.prisma.todo.create({
        data: createTodo,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(todo_id: string, data: UpdateTodoDto) {
    try {
      return await this.prisma.todo.update({
        where: { todo_id },
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(todo_id: string) {
    try {
      return await this.prisma.todo.delete({ where: { todo_id } });
    } catch (error) {
      console.log(error);
    }
  }
}
