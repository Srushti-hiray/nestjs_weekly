import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateEmploymentDto } from './dto/create-employement.dto';
import { HourlyRateValidationPipe } from './pipes/hourly-rate-validation.pipe';

@Injectable()
export class EmploymentService {
  async createEmployment(body: any, countryCode: string) {
    const createEmploymentDto = plainToClass(CreateEmploymentDto, body);
    const errors = await validate(createEmploymentDto);

    if (errors.length > 0) {
      throw new BadRequestException({
        errors: this.formatValidationErrors(errors, body.metadata),
      });
    }

    if (createEmploymentDto.employmentType === 'contractor') {
      if (!createEmploymentDto.contractorDetails) {
        throw new BadRequestException({
          errors: {
            contractorDetails: {
              code: 'MISSING_CONTRACTOR_DETAILS',
              message: 'contractorDetails is required for contractor employment',
            },
          },
        });
      }

      const ratePipe = new HourlyRateValidationPipe(countryCode);
      try {
        createEmploymentDto.contractorDetails.hourlyRate = ratePipe.transform(
          createEmploymentDto.contractorDetails.hourlyRate
        );
      } catch (error) {
        throw error;
      }
    }

    const metadataErrors = this.validateMetadata(body.metadata || {});
    if (Object.keys(metadataErrors).length > 0) {
      throw new BadRequestException({
        errors: { metadata: metadataErrors },
      });
    }

    return {
      success: true,
      data: createEmploymentDto,
    };
  }

  private formatValidationErrors(errors: any[], metadata?: Record<string, string>) {
    const formattedErrors = {};

    errors.forEach(error => {
      if (error.children && error.children.length > 0) {
        error.children.forEach(nestedError => {
          const key = `${error.property}.${nestedError.property}`;
          if (nestedError.constraints) {
            formattedErrors[key] = Object.values(nestedError.constraints).map(msg => ({
              code: msg,
            }));
          }
        });
      } else if (error.constraints) {
        formattedErrors[error.property] = Object.values(error.constraints).map(msg => ({
          code: msg,
        }));
      }
    });

    return formattedErrors;
  }

  private validateMetadata(metadata: Record<string, string>) {
    const errors: {
      invalidKeys?: {
        code: string;
        message: string;
        keys: string[];
      };
      longValues?: {
        code: string;
        message: string;
        keys: string[];
      };
    } = {};

    const invalidKeys: string[] = [];
    const longValues: string[] = [];

    Object.entries(metadata).forEach(([key, value]) => {
      if (!/^[a-z0-9_]+$/.test(key)) {
        invalidKeys.push(key);
      }
      if (typeof value === 'string' && value.length > 255) {
        longValues.push(key);
      }
    });

    if (invalidKeys.length > 0) {
      errors.invalidKeys = {
        code: 'INVALID_METADATA_KEYS',
        message: 'Keys must contain only lowercase letters, numbers, and underscores',
        keys: invalidKeys,
      };
    }

    if (longValues.length > 0) {
      errors.longValues = {
        code: 'METADATA_VALUE_TOO_LONG',
        message: 'Values must be 255 characters or less',
        keys: longValues,
      };
    }

    return errors;
  }
}
