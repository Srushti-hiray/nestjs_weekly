import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CountryRates } from '../constant/country-rates';

@Injectable()
export class HourlyRateValidationPipe implements PipeTransform {
  constructor(private readonly countryCode: string) {}

  transform(value: any) {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      throw new BadRequestException({
        errors: {
          'contractorDetails.hourlyRate': {
            code: 'INVALID_NUMBER',
            message: 'Hourly rate must be a valid number',
          },
        },
      });
    }

    const rates = CountryRates[this.countryCode] || CountryRates.DEFAULT;

    if (numericValue < rates.min || numericValue > rates.max) {
      throw new BadRequestException({
        errors: {
          'contractorDetails.hourlyRate': {
            code: 'RATE_OUT_OF_RANGE',
            allowedRanges: {
              US: [CountryRates.US.min, CountryRates.US.max],
              EU: [CountryRates.EU.min, CountryRates.EU.max],
            },
            message: `Hourly rate must be between ${rates.min} and ${rates.max} for ${this.countryCode}`,
            currentValue: numericValue,
          },
        },
      });
    }

    return numericValue;
  }
}