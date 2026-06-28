import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserModel } from './types';

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const result = ret as any;
        result.id = result._id?.toString();
        delete result._id;
        delete result.__v;
        return result;
      },
    },
    toObject: { virtuals: true },
  }
);

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  // Only hash password if it is new or modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

// Compare input password with database hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword?: string
): Promise<boolean> {
  const hash = userPassword || this.password;
  if (!hash) return false;
  return await bcrypt.compare(candidatePassword, hash);
};

export const User = model<IUser, IUserModel>('User', userSchema);
export default User;
