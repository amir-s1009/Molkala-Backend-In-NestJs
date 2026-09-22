import { ActionOutput } from '@/actions/types';
import { JWT } from './AuthUtils.js';
import Authentication from './Authentication.js';

export default class Authorization {
  static async authorizeAdmin(): Promise<
    | {
        payload: JWT;
        actionOutput: undefined;
      }
    | {
        payload: undefined;
        actionOutput: ActionOutput;
      }
  > {
    const authenticationResult = await Authentication.authenticate();
    if (!authenticationResult.data)
      return {
        actionOutput: {
          ok: authenticationResult.ok,
          code: authenticationResult.code,
          message: authenticationResult.message,
        },
        payload: undefined,
      };
    if (!authenticationResult.data.roles.find((role) => role === 'ADMIN'))
      return {
        actionOutput: {
          ok: false,
          code: 403,
          message: 'عملیات محدود به کاربران ادمین میباشد.',
        },
        payload: undefined,
      };
    return {
      actionOutput: undefined,
      payload: {
        roles: authenticationResult.data.roles,
        userId: authenticationResult.data.userId,
      },
    };
  }
  static async authorizeUser(): Promise<
    | {
        payload: JWT;
        actionOutput: undefined;
      }
    | {
        payload: undefined;
        actionOutput: ActionOutput;
      }
  > {
    const authenticationResult = await Authentication.authenticate();
    if (!authenticationResult.data)
      return {
        actionOutput: {
          ok: authenticationResult.ok,
          code: authenticationResult.code,
          message: authenticationResult.message,
        },
        payload: undefined,
      };
    if (!authenticationResult.data.roles.find((role) => role === 'USER'))
      return {
        actionOutput: {
          ok: false,
          code: 403,
          message: 'عملیات محدود به کاربران لاگین شده میباشد.',
        },
        payload: undefined,
      };
    return {
      actionOutput: undefined,
      payload: {
        roles: authenticationResult.data.roles,
        userId: authenticationResult.data.userId,
      },
    };
  }
}
