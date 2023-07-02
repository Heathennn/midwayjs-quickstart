import { HttpStatus, MidwayHttpError } from '@midwayjs/core';

export class LoginError extends MidwayHttpError {
  constructor() {
    super('账号或密码有误', HttpStatus.BAD_REQUEST);
  }
}
