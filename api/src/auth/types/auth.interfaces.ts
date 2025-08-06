import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export interface JwtPayload {
  userId: number;
  userName: string;
  iat: Date;
  exp: Date;
}
