import pool from './index.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  location?: string;
  hobbies?: string;
  avatar?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  bio?: string;
  location?: string;
  hobbies?: string;
  avatar?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  phone?: string;
}

export const userDb = {
  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await pool.query(`
      INSERT INTO users (id, email, password, name, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, data.email, hashedPassword, data.name, now, now]);

    return {
      id,
      email: data.email,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    };
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id: string): Promise<Omit<User, 'password'> | undefined> {
    const result = await pool.query(
      'SELECT id, email, name, bio, location, hobbies, avatar, "linkedIn", github, website, phone, "createdAt", "updatedAt" FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async updateProfile(id: string, data: UpdateUserProfileDto): Promise<Omit<User, 'password'> | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await pool.query(`
      UPDATE users 
      SET name = $1, bio = $2, location = $3, hobbies = $4, avatar = $5, 
          "linkedIn" = $6, github = $7, website = $8, phone = $9, "updatedAt" = $10
      WHERE id = $11
    `, [
      updated.name,
      updated.bio || null,
      updated.location || null,
      updated.hobbies || null,
      updated.avatar || null,
      updated.linkedIn || null,
      updated.github || null,
      updated.website || null,
      updated.phone || null,
      updated.updatedAt,
      id,
    ]);

    return updated;
  },

  async verifyPassword(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
