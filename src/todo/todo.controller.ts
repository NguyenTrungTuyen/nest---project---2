import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Get('search')
  async search(@Query('status') status: string, @Query('title') title: string) {
    const boolStatus = status !== undefined ? status === 'true' : undefined;
    return this.todoService.search(boolStatus, title);
  }

  @Post()
  async create(
    @Body() body: { title: string; description?: string },
  ): Promise<Todo> {
    return this.todoService.create(body.title, body.description);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title: string; completed: boolean },
  ) {
    return this.todoService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }
}
