import { dbGet, dbRun } from '../config/db';
import { User, Role, Status } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  static async findByEmail(email: string): Promise<User | undefined> {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return user as User | undefined;
  }

  static async findById(id: string): Promise<User | undefined> {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    return user as User | undefined;
  }

  static async createUser(email: string, passwordHash: string, role: Role = Role.VIEWER): Promise<User> {
    const id = uuidv4();
    await dbRun(
      'INSERT INTO users (id, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [id, email, passwordHash, role, Status.ACTIVE]
    );
    return {
      id,
      email,
      role,
      status: Status.ACTIVE,
      created_at: new Date().toISOString()
    };
  }
}
