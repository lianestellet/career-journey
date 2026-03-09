import pool from './index.js';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/index.js';
import { randomUUID } from 'crypto';

export const companyDb = {
  async getAll(userId?: string): Promise<Company[]> {
    if (userId) {
      const result = await pool.query('SELECT * FROM companies WHERE "userId" = $1 ORDER BY "order" ASC, "startDate" DESC', [userId]);
      return result.rows as Company[];
    }
    const result = await pool.query('SELECT * FROM companies ORDER BY "order" ASC, "startDate" DESC');
    return result.rows as Company[];
  },

  async getById(id: string): Promise<Company | undefined> {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    return result.rows[0] as Company | undefined;
  },

  async create(data: CreateCompanyDto, userId: string): Promise<Company> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const maxOrderResult = await pool.query('SELECT MAX("order") as "maxOrder" FROM companies WHERE "userId" = $1', [userId]);
    const order = (maxOrderResult.rows[0]?.maxOrder ?? -1) + 1;

    const company: Company = {
      id,
      userId,
      ...data,
      order,
      createdAt: now,
      updatedAt: now,
    };

    await pool.query(`
      INSERT INTO companies (id, "userId", name, description, "startDate", "endDate", location, role, "order", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      company.id,
      company.userId,
      company.name,
      company.description,
      company.startDate,
      company.endDate ?? null,
      company.location ?? null,
      company.role,
      company.order,
      company.createdAt,
      company.updatedAt
    ]);

    return company;
  },

  async update(id: string, data: UpdateCompanyDto): Promise<Company | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await pool.query(`
      UPDATE companies 
      SET name = $1, description = $2, "startDate" = $3, "endDate" = $4, location = $5, role = $6, "updatedAt" = $7
      WHERE id = $8
    `, [
      updated.name,
      updated.description,
      updated.startDate,
      updated.endDate ?? null,
      updated.location ?? null,
      updated.role,
      updated.updatedAt,
      id
    ]);

    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM companies WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  async updateOrder(id: string, newOrder: number): Promise<boolean> {
    const result = await pool.query('UPDATE companies SET "order" = $1 WHERE id = $2', [newOrder, id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },
};
