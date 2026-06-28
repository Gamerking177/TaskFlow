import jwt from 'jsonwebtoken';
import { UserRepository } from './repository';
import { RegisterInput, LoginInput, IUser } from './types';
import { AppError } from '../../utils/appError';
import { env } from '../../config/env';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public generateToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  public verifyToken(token: string): any {
    return jwt.verify(token, env.JWT_SECRET);
  }

  public async register(input: RegisterInput): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError('A user with this email already exists', 400);
    }
    
    const newUser = await this.userRepository.create(input);
    newUser.password = undefined; // Strip password before returning
    return newUser;
  }

  public async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepository.findByEmail(input.email, true);
    
    if (!user || !(await user.correctPassword(input.password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user.id);
    user.password = undefined; // Strip password before returning
    
    return { user, token };
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }
}
export default AuthService;
