import { Document, Model } from 'mongoose';
import { z } from 'zod';
import { registerSchema, loginSchema } from './validation';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  correctPassword(candidatePassword: string, userPassword?: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthResponseData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}
