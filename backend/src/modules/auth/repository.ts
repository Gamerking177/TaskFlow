import { User } from './userModel';
import { IUser, RegisterInput } from './types';

export class UserRepository {
  async findByEmail(email: string, selectPassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (selectPassword) {
      query.select('+password');
    }
    return await query;
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async create(userData: RegisterInput): Promise<IUser> {
    return await User.create(userData);
  }
}
