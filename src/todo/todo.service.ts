import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';

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

  async update(id: string, data: { title: string; completed: boolean }){
    return this.todoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id);
  }

  // tìm kiếm theo title và lọc theo completed 
  async search(status?: boolean, title?: string): Promise<Todo[]> {
    const query: any = {};

    // Lọc theo trạng thái (nếu có)
    if (status !== undefined) {
      query.completed = status;
    }

    // Lọc theo title (tìm kiếm gần đúng, không phân biệt hoa thường)
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // 'i' để không phân biệt hoa thường
    }

    return this.todoModel.find(query);
  }

}
