import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/service';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // 1) Retrieve token from cookies or authorization header
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // 2) Verify token
  const authService = new AuthService();
  let decoded: any;
  
  try {
    decoded = authService.verifyToken(token);
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  // 3) Check if the user still exists in the database
  const currentUser = await authService.getUserById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4) Grant access and attach user to Request object
  req.user = currentUser;
  next();
});
export default protect;
