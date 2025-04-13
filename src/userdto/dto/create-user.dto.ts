// create-user.dto.ts
import { 
    IsString, 
    IsEmail, 
    IsInt, 
    Min, 
    Max, 
    Length, 
    IsNotEmpty 
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
    lastName: string;
  
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
  
    @IsInt()
    @Min(18, { message: 'Age must be at least 18' })
    @Max(65, { message: 'Age must not exceed 65' })
    age: number;
  }