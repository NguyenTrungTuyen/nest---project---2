import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';
import { SearchTodoDto } from './tdo/SearchTodo.tdo';
import { CreateTodoDTo } from './tdo/create.tdo';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Api - Todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  //lấy tất cả công việc
  @Get()
  @ApiOperation({ summary: 'TẤT CẢ CÔNG VIỆC' })
  @ApiOkResponse({
    description: 'DANH SÁCH TỔNG HỢP',
    type: [Todo],
  })
  //lấy tất cả công việc
  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  //Tìm kiếm và lọc
  @Get('search')
  @ApiOperation({ summary: 'TÌM KIẾM VÀ PHÂN TRANG THEO CURSOR' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'LỌC THEO TRẠNG THÁI (true/false)',
    example: 'true',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'LỌC THEO TIÊU ĐỀ',
    example: 'shopping',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'CURSOR (_id CỦA TASK CUỐI CÙNG) ĐỂ LẤY TRANG TIẾP THEO',
    example: '66c123456789abcdef123456',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'SỐ LƯỢNG TASK MỖI TRANG',
    example: 5,
  })
  @ApiOkResponse({
    description: 'PHÂN TRANG THEO CURSOR - KẾT QUẢ',
    schema: {
      type: 'object',
      properties: {
        todos: { type: 'array', items: { $ref: '#/components/schemas/Todo' } },
        totalItems: { type: 'number', example: 20 },
        nextCursor: {
          type: 'string',
          nullable: true,
          example: '66c123456789abcdef123456',
        },
      },
    },
  })
  //Tìm kiếm và lọc
  async search(
    @Query(ValidationPipe) query: SearchTodoDto): Promise<{
    todos: Todo[];
    totalItems: number;
    nextCursor: string | null;
  }> {
    const boolStatus =
      query.status !== undefined ? query.status === 'true' : undefined;
    const limitNumber = query.limit || 5;

    return this.todoService.search(
      boolStatus,
      query.title,
      query.cursor,
      limitNumber,
    );
  }

  //Tìm kiếm theo ID
  @Get(':id')
  @ApiOperation({ summary: 'TÌM THEO ID' })
  @ApiParam({
    name: 'id',
    description: 'Todo ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'KẾT QUẢ: ',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'KHÔNG TÌM THẤY',
  })
  //Tìm kiếm theo ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  //Thêm
  @Post()
  @ApiOperation({ summary: 'THÊM CV MỚI' })
  @ApiBody({
    type: CreateTodoDTo,
    description: 'THÊM CV',
    examples: {
      basic: {
        summary: 'Basic todo',
        value: { title: 'Buy groceries' },
      },
      withDescription: {
        summary: 'MÔ TẢ',
        value: {
          title: 'Learn NestJS',
          description: 'Study Swagger integration',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'THÊM OK',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'NHẬP SAI',
  })
  //Thêm
  @Post()
  async create(
    @Body() body: { title: string; description?: string },
  ): Promise<Todo> {
    return this.todoService.create(body.title, body.description);
  }

  //update
  @Put(':id')
  @ApiOperation({ summary: 'CẬP NHẬT 1 CV' })
  @ApiParam({
    name: 'id',
    description: 'CẬP NHẬT THEO ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    description: 'CẬP NHẬT',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'CẬP NHẬT TIÊU ĐỀ' },
        completed: { type: 'boolean', example: true },
      },
      required: ['title', 'completed'],
    },
  })
  @ApiOkResponse({
    description: 'CẬP NHẬT OK',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'KHÔNG TÌM THẤY',
  })

  //update
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title: string; completed: boolean },
  ) {
    return this.todoService.update(id, body);
  }

  //delete
  @Delete(':id')
  @ApiOperation({ summary: 'XÓA 1' })
  @ApiParam({
    name: 'id',
    description: 'XÓA THEO ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'XOA OK',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'KHÔNG TÌM THẤY',
  })
  //delete
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }
}
