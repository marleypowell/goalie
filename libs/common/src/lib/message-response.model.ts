import { HttpStatus } from '@nestjs/common';

export class MessageResponse<T> {
  public readonly status: HttpStatus;
  public readonly data: T | null | undefined;
  public readonly error?: string | string[];

  public constructor(status: HttpStatus, data: T | null | undefined, error?: string | string[]) {
    this.status = status;
    this.data = data;
    this.error = error;
  }
}
