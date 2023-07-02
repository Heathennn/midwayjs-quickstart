import { Aspect, IMethodAspect, JoinPoint } from '@midwayjs/core';
import { WiringController } from '../controller/wiring.controller';
import { UserController } from '../controller/user.controller';

@Aspect(WiringController)
@Aspect(UserController)
export class RouterReturnRewrite implements IMethodAspect {
  async before(joinPoint: JoinPoint) {
    console.log('before');
  }
  // 统一修改返回结果
  async afterReturn(joinPoint: JoinPoint, result: any) {
    return {
      code: 200,
      data: result,
      msg: 'success',
    };
  }
}
