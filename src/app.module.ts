import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';//gói phụ thuộc 
import { MongooseModule } from '@nestjs/mongoose';// cấu hình kết nối 
import { TodoModule } from './todo/todo.module';


@Module({
  imports: [
    //  MongooseModule.forRoot('mongodb://localhost:27017/todo'),
     ConfigModule.forRoot({ isGlobal: true }), 
     MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/todos'),
     TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
