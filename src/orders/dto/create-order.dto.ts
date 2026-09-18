import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class createOrderdto {
    @ApiProperty({ description: 'ID of the associated product', example: 1 })
    @Type(() => Number)
    @IsInt({ message: 'productId must be an integer' })
    @IsNotEmpty({ message: 'productId is required' })
    productId: number;


    @ApiProperty({ description: "give the quantity  ammount that  you want to give order" })
    @IsNotEmpty({ message: "quantity is required" })
    @Type(() => Number)
    @IsInt({ message: "quantity must be a number" })
    @IsPositive({ message: "quantity must be positive" })
    quantity: number
}