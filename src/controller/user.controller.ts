import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { LoginFormDTO } from '../dto/user';
import { LoginError } from '../error/custorm.error';
@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Post('/login')
  async userLogin(@Body() params: LoginFormDTO) {
    if (params.username === 'admin' && params.password === 'zaozao123') {
      return {
        token: '123',
      };
    } else {
      throw new LoginError();
    }
  }

  @Post('/logout')
  async userLogout() {
    return '登出成功';
  }

  @Post('/info')
  async userInfo() {
    return '张三';
  }
}
