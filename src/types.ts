export type ApiOutput<D = undefined, M = undefined> = {
  ok: boolean;
  code: number;
  message?: string;
  data?: D;
  meta?: M;
};

export type ApiResult<D = undefined, M = undefined> = Promise<ApiOutput<D, M>>;

export class CustomApiOutput<D = undefined, M = undefined> {
  constructor(
    readonly output: {
      message?: string;
      data?: D;
      meta?: M;
    },
  ) {}
}
