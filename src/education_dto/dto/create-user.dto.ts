import {
    IsString,
    IsNotEmpty,
    IsOptional,
    Length,
    IsArray,
    ValidateNested,
    IsIn,
    Min,
    Max,
    IsUUID,
    validate,
    ValidationError,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { plainToClass } from 'class-transformer';
  
  // Custom postal code validator
  function isValidPostalCode(value: string, country: 'US' | 'UK' | 'IN'): boolean {
    const patterns = {
      US: /^\d{5}(-\d{4})?$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      IN: /^\d{6}$/,
    };
    return patterns[country].test(value);
  }
  
  class AddressDto {
    @IsUUID()
    @IsOptional() // Add this decorator
    id?: string; // Make it optional with ?
   
  
    @IsString()
    @Length(5, 100, { message: 'Street must be between 5-100 characters' })
    street: string;
  
    @IsNotEmpty()
    @IsString()
    postalCode: string;
  }
  
  class EducationDto {
    @IsIn(['BSc', 'MSc', 'PhD'], { message: 'Degree must be BSc, MSc, or PhD' })
    degree: string;
  
    @Min(1990, { message: 'Year must be 1990 or later' })
    @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
    year: number;
  }
  
  export class CreateUserDto {
    @IsString()
    id: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    education: EducationDto[];
  }
  
  // Validation function specific to this DTO
  export async function validateCreateUserDto(data: any) {
    const user = plainToClass(CreateUserDto, data);
    const errors = await validate(user);
  
    // Additional custom validation for postal code
    if (user.address && !isValidPostalCode(user.address.postalCode, 'US')) {
      if (!errors.some(e => e.property === 'address')) {
        errors.push({
          property: 'address',
          children: [],
          constraints: { isValidPostalCode: 'Invalid postal code format' },
        });
      }
    }
  
    if (errors.length > 0) {
      return formatValidationErrors(errors);
    }
    return null;
  }
  
  // Format errors as requested
  function formatValidationErrors(errors: ValidationError[]) {
    const formattedErrors: { field: string; code: string }[] = [];
  
    function processError(error: ValidationError, parentPath = '') {
      const currentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  
      if (error.constraints) {
        for (const constraint in error.constraints) {
          let code = '';
          
          switch (constraint) {
            case 'isIn':
              code = 'INVALID_DEGREE';
              break;
            case 'min':
            case 'max':
              code = 'INVALID_YEAR';
              break;
            case 'isValidPostalCode':
            case 'isPostalCode':
              code = 'INVALID_POSTAL_CODE';
              break;
            case 'isString':
              code = 'INVALID_STRING';
              break;
            case 'length':
              code = 'INVALID_LENGTH';
              break;
            case 'isUUID':
              code = 'INVALID_UUID';
              break;
            default:
              code = 'INVALID_FIELD';
          }
  
          formattedErrors.push({
            field: currentPath,
            code,
          });
        }
      }
  
      if (error.children && error.children.length > 0) {
        for (const child of error.children) {
          processError(child, currentPath);
        }
      }
    }
  
    for (const error of errors) {
      processError(error);
    }
  
    return { errors: formattedErrors };
  }