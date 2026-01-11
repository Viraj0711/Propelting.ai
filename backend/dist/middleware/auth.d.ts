import { Request, Response, NextFunction } from 'express';
interface JwtPayload {
    userId: string;
    email: string;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=auth.d.ts.map