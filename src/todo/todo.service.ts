import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { skip } from 'node:test';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}
  async create(title: string, description?: string): Promise<Todo> {
    const todo = new this.todoModel({ title, description });
    return todo.save();
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find();
  }

  async findOne(id: string): Promise<Todo | null> {
    return this.todoModel.findById(id);
  }

  async update(id: string, data: { title: string; completed: boolean }) {
    return this.todoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id);
  }

  async search(
    status?: boolean,
    title?: string,
    cursor?: string,
    limit: number = 2,
  ): Promise<{
    todos: TodoDocument[];
    totalItems: number;
    nextCursor: string | null;
  }> {
    const query: any = {};

    // Áp dụng bộ lọc status và title
    if (status !== undefined) {
      query.completed = status;
    }
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Nếu có cursor, thêm điều kiện để lấy các document sau cursor
    if (cursor) {
      query._id = { $gt: new Types.ObjectId(cursor) };
    }

    // Lấy danh sách todos với limit và sắp xếp theo _id tăng dần
    const todos: TodoDocument[] = await this.todoModel
      .find(query)
      .sort({ _id: 1 }) // Sắp xếp theo _id để đảm bảo thứ tự nhất quán
      .limit(limit);

    // Đếm tổng số todos khớp với bộ lọc (không tính cursor)
    const totalQuery = { ...query };
    if (totalQuery._id) {
      delete totalQuery._id; // Loại bỏ điều kiện cursor để đếm tổng
    }
    const totalItems = await this.todoModel.countDocuments(totalQuery);

    // Xác định nextCursor: _id của document cuối cùng (nếu có)
    const nextCursor = todos.length > 0 ? todos[todos.length - 1]._id.toString() : null;

    return {
      todos,
      totalItems,
      nextCursor,
    };
  }
}
