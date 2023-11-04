import { TRPCError } from '@trpc/server';
import log from '@/libs/logger';

export interface APIError {
  url: string;
  status: number;
  statusText: string;
  body: string;
}

enum HttpStatusCodeEnum {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_SUPPORTED = 'METHOD_NOT_SUPPORTED',
  TIMEOUT = 'TIMEOUT',
  CONFLICT = 'CONFLICT',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  UNPROCESSABLE_CONTENT = 'UNPROCESSABLE_CONTENT',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  CLIENT_CLOSED_REQUEST = 'CLIENT_CLOSED_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

type HttpStatusCodeType = {
  [code: number]: HttpStatusCodeEnum;
};

export const HttpStatusCode: HttpStatusCodeType = {
  400: HttpStatusCodeEnum.BAD_REQUEST,
  401: HttpStatusCodeEnum.UNAUTHORIZED,
  403: HttpStatusCodeEnum.FORBIDDEN,
  404: HttpStatusCodeEnum.NOT_FOUND,
  405: HttpStatusCodeEnum.METHOD_NOT_SUPPORTED,
  408: HttpStatusCodeEnum.TIMEOUT,
  409: HttpStatusCodeEnum.CONFLICT,
  412: HttpStatusCodeEnum.PRECONDITION_FAILED,
  413: HttpStatusCodeEnum.PAYLOAD_TOO_LARGE,
  422: HttpStatusCodeEnum.UNPROCESSABLE_CONTENT,
  429: HttpStatusCodeEnum.TOO_MANY_REQUESTS,
  499: HttpStatusCodeEnum.CLIENT_CLOSED_REQUEST,
  500: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
};

export function handleAPIError(e: any) {
  const err = e as APIError;
  const msg = {
    code: HttpStatusCode[err.status],
    message: err.statusText,
    cause: err.body,
  };
  log().Error(new Error(), JSON.stringify(msg));
  throw new TRPCError(msg);
}
