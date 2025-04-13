import { RequestTimeoutException } from '@nestjs/common';

export function Timeout(delay: number): MethodDecorator {
  return function (target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new RequestTimeoutException(`Request took longer than ${delay}ms`));
        }, delay);

        Promise.resolve(originalMethod.apply(this, args))
          .then(result => {
            clearTimeout(timeout);
            resolve(result);
          })
          .catch(err => {
            clearTimeout(timeout);
            reject(err);
          });
      });
    };
  };
}
