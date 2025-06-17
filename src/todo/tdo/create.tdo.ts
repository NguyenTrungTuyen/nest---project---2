import { ApiProperty } from "@nestjs/swagger";

export class CreateTodoDTo{
    @ApiProperty({description:'Tiêu đề công việc', example:'cleaner'})
    title: string;

    @ApiProperty({description:'Mô tả công việc', example:'dọn dẹp'})
    description: string;
}