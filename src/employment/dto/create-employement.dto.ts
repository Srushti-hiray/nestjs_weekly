
import { 
    IsIn, IsObject, ValidateNested, IsOptional, IsArray, 
    IsDate, IsNumber, IsString, IsNotEmpty, registerDecorator, 
    ValidationOptions, ValidationArguments,
    ValidatorConstraint, ValidatorConstraintInterface ,Validate 
  } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Add this custom validator for metadata
@ValidatorConstraint({ name: 'validMetadataKeys', async: false })
export class IsMetadataKeysValidConstraint implements ValidatorConstraintInterface {
  validate(metadata: Record<string, string>, args: ValidationArguments) {
    if (!metadata) return true;
    return Object.keys(metadata).every(key => /^[a-z0-9_]+$/.test(key));
  }

  defaultMessage(args: ValidationArguments) {
    return 'Metadata keys can only contain lowercase letters, numbers, and underscores';
  }
}

@ValidatorConstraint({ name: 'validMetadataValues', async: false })
export class IsMetadataValuesValidConstraint implements ValidatorConstraintInterface {
  validate(metadata: Record<string, string>, args: ValidationArguments) {
    if (!metadata) return true;
    return Object.values(metadata).every(val => typeof val === 'string' && val.length <= 255);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Metadata values must be strings with max length of 255 characters';
  }
}

function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value instanceof Date && value > new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}

function IsAfterDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value instanceof Date && relatedValue instanceof Date && value > relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be after ${relatedPropertyName}`;
        },
      },
    });
  };
}

function ValidateIf(condition: (object: any) => boolean, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateIf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return condition(args.object);
        },
      },
    });
  };
}

export class FullTimeDetailsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  benefits: string[];

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  @IsFutureDate()
  joiningDate: Date;
}

export class ContractorDetailsDto {
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  contractStart: Date;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  @IsAfterDate('contractStart')
  contractEnd: Date;

  @IsNumber()
  hourlyRate: number;
}

export class CreateEmploymentDto {
    @IsIn(['full-time', 'contractor'])
    employmentType: 'full-time' | 'contractor';
  
    @IsOptional()
    @ValidateNested()
    @Type(() => FullTimeDetailsDto)
    @ValidateIf((o: CreateEmploymentDto) => o.employmentType === 'full-time', {
      message: 'fullTimeDetails is required when employmentType is full-time',
    })
    fullTimeDetails?: FullTimeDetailsDto;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => ContractorDetailsDto)
    @ValidateIf((o: CreateEmploymentDto) => o.employmentType === 'contractor')
    contractorDetails?: ContractorDetailsDto;
  
    @IsObject()
    @Validate(IsMetadataKeysValidConstraint)
    @Validate(IsMetadataValuesValidConstraint)
    metadata: Record<string, string>;
  }