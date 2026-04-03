import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { UserService } from '../services/user.service';
import { registerSchema, loginSchema } from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_development_purposes_only';

export class AuthController {
  static async register(req: Request, res: Response) {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const { email, password, role } = parseResult.data;

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await UserService.createUser(email, passwordHash, role as any);

    const token = jwt.encode({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

    // Don't send back password or hash
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ user: userWithoutPassword, token });
  }

  static async login(req: Request, res: Response) {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const { email, password } = parseResult.data;

    const user = await UserService.findByEmail(email);
    if (!user || user.status === 'INACTIVE') {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const token = jwt.encode({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ user: userWithoutPassword, token });
  }
}
