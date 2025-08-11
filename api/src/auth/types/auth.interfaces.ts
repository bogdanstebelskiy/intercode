import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    userName: string;
  };
}

export interface JwtPayload {
  userId: string;
  userName: string;
  iat: Date;
  exp: Date;
}
