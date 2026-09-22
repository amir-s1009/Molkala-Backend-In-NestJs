import { ActionResult } from '@/actions/types';
import { getAccessToken } from '@/utils/cookie';
import AuthUtils, { JWT } from './AuthUtils.js';

export default class Authentication {
  static async authenticate(): ActionResult<JWT> {
    try {
      const token = await getAccessToken();
      if (!token)
        return {
          ok: false,
          code: 401,
          message: 'برای ادامه عملیات نیاز به ورود به سامانه دارید.',
        };
      const claimsSet = await AuthUtils.validateJwt(token);
      return {
        ok: true,
        code: 200,
        data: claimsSet,
      };
    } catch {
      return {
        ok: false,
        code: 401,
        message: 'توکن شما نامعتبر است و یا منقضی شده است.',
      };
    }
  }
}
