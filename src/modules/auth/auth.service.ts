import { Injectable } from '@nestjs/common';
import {
  loginUserDTOReq,
  loginUserDTORes,
  SignupUserDTOReq,
} from './web.dto.js';
import { prisma } from '../../db/prisma.js';
import AuthDomain from './auth.domain.js';
import {
  BadRequestError,
  NotFoundError,
  TooManyRequestsError,
} from '../../errors.js';

@Injectable()
export class AuthService {
  constructor(private authDomain: AuthDomain) {}

  async signup(data: SignupUserDTOReq) {
    const userFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userFound)
      throw new BadRequestError('ایمیل قبلا در سیستم ثبت شده است.');

    const hashedPassword = await this.authDomain.hashPassword(data.password);

    await prisma.$transaction(async (tx) => {
      const userCreated = await tx.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashedPassword,
        },
      });
      await tx.userRole.create({
        data: {
          title: 'USER',
          userId: userCreated.id,
        },
      });
    });
  }

  async login(data: loginUserDTOReq): Promise<loginUserDTORes> {
    const failedLoginTrials = await prisma.loginLog.findMany({
      where: {
        email: data.email,
        createdAt: {
          lt: new Date(Date.now() - 30 * 60 * 1000),
        },
        isSuccessful: false,
      },
    });
    if (failedLoginTrials.length === 3)
      throw new TooManyRequestsError(
        'شما بیش از حد مجاز رمز عبور خود را اشتباه وارد کردید.',
      );
    const userFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        roles: {
          select: {
            title: true,
          },
        },
      },
    });
    if (!userFound) throw new NotFoundError('ایمیل شما در سامانه یافت نشد.');

    const isValid = await this.authDomain.validatePassword(
      data.password,
      userFound.password,
    );
    if (!isValid) {
      await prisma.loginLog.create({
        data: {
          email: data.email,
          isSuccessful: false,
        },
      });
      throw new BadRequestError(
        'رمز عبور شما برای سومین بار متوالی اشتباه وارد شد و تا نیم ساعت دیگر امکان لاگین ندارید..',
      );
    }

    await prisma.loginLog.create({
      data: {
        email: data.email,
        isSuccessful: true,
      },
    });

    const token = await this.authDomain.signJwt({
      userId: userFound.id,
      roles: userFound.roles.map((role) => role.title),
    });

    return {
      token,
    };
  }
}
