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
  @ApiOperation({ summary: 'Tat ca cong viec' })
  @ApiOkResponse({
    description: 'Danh sach cong viec',
    type: [Todo],
  })
  //lấy tất cả công việc 
  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  //Tìm kiếm và lọc
  @Get('search')
  @ApiOperation({ summary: 'Tim kiem voi phan trang' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Loc theo trang thai (true/false)',
    example: 'true',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Loc theo tieu de cong viec',
    example: 'shopping',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'So trang',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'So luong Item moi trang',
    example: '10',
  })
  @ApiOkResponse({
    description: 'Ket qua phan trang tim kiem',
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
  @ApiOperation({ summary: 'Tim theo ID' })
  @ApiParam({
    name: 'id',
    description: 'Todo ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Ket qua tim kiem cho: ',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Khong tim thay',
  })
//Tìm kiếm theo ID
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  //Thêm 
  @Post()
  @ApiOperation({ summary: 'Them cong viec moi' })
  @ApiBody({
    type: CreateTodoDTo,
    description: 'Tao du lieu cong viec',
    examples: {
      basic: {
        summary: 'Basic todo',
        value: { title: 'Buy groceries' },
      },
      withDescription: {
        summary: 'Mo ta cong viec',
        value: {
          title: 'Learn NestJS',
          description: 'Study Swagger integration',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Them thanh cong',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Du lieu khong hop le',
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
  @ApiOperation({ summary: 'Update a todo' })
  @ApiParam({
    name: 'id',
    description: 'Cong viec cap nhat theo ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    description: 'Cap nhat cong viec',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Cap nhat tieu de cong viec' },
        completed: { type: 'boolean', example: true },
      },
      required: ['title', 'completed'],
    },
  })
  @ApiOkResponse({
    description: 'Cap nhat thanh cong',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found',
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
  @ApiOperation({ summary: 'Xoa 1 cong viec' })
  @ApiParam({
    name: 'id',
    description: 'Xoa cong viec theo ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Xoa thanh cong',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found',
  })
  //delete
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }
}
