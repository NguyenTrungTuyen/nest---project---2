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
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';
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
  @ApiOperation({ summary: 'TÌM KIẾM VÀ PHÂN TRANG' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'LỌC THEO TRANG THÁI (true/false)',
    example: 'true',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'LỌC THEO TIÊU ĐỀ',
    example: 'shopping',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'SỐ TRANG',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'SỐ LƯỢNG CV MỖI TRANG',
    example: '10',
  })
  @ApiOkResponse({
    description: 'PHÂN TRANG - KẾT QUẢ',
    type: [Todo],
  })

  //Tìm kiếm và lọc
  @Get('search')
  async search(
    @Query('status') status: string,
    @Query('title') title: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const boolStatus = status !== undefined ? status === 'true' : undefined;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 5;
    return this.todoService.search(boolStatus, title, pageNumber, limitNumber);
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
