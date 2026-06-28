import { Request, Response } from 'express';
import { AuthService } from './service';
import { registerSchema, loginSchema } from './validation';
import { catchAsync } from '../../utils/catchAsync';
import { env } from '../../config/env';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private getCookieOptions = () => {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: (env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax' | 'none',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
  };

  public register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    const user = await this.authService.register(validatedData);
    const token = this.authService.generateToken(user.id);

    res.cookie('token', token, this.getCookieOptions());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  });

  public login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate credentials
    const validatedData = loginSchema.parse(req.body);

    const { user, token } = await this.authService.login(validatedData);

    res.cookie('token', token, this.getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  });

  public logout = catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      sameSite: (env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax' | 'none',
      secure: env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  public getMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = req.user; // req.user is set by the protect middleware

    res.status(200).json({
      success: true,
      message: 'Current user profile fetched successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  });
}

export default AuthController;
