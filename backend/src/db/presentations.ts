import pool from './index.js';
import type { Presentation, CreatePresentationDto, UpdatePresentationDto } from '../types/index.js';
import { randomUUID } from 'crypto';

export const presentationDb = {
  async getAll(userId?: string): Promise<Presentation[]> {
    if (userId) {
      const result = await pool.query('SELECT * FROM presentations WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);
      return result.rows.map(row => this.deserialize(row));
    }
    const result = await pool.query('SELECT * FROM presentations ORDER BY "createdAt" DESC');
    return result.rows.map(row => this.deserialize(row));
  },

  async getById(id: string): Promise<Presentation | undefined> {
    const result = await pool.query('SELECT * FROM presentations WHERE id = $1', [id]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : undefined;
  },

  async create(data: CreatePresentationDto, userId: string): Promise<Presentation> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const presentation: Presentation = {
      id,
      userId,
      name: data.name,
      targetRole: data.targetRole,
      targetCompany: data.targetCompany,
      notes: data.notes,
      showPersonalInfo: data.showPersonalInfo ?? true,
      hiddenCompanyIds: data.hiddenCompanyIds ?? [],
      hiddenProjectIds: data.hiddenProjectIds ?? [],
      customOrder: data.customOrder ?? [],
      createdAt: now,
      updatedAt: now,
    };

    await pool.query(`
      INSERT INTO presentations (id, "userId", name, "targetRole", "targetCompany", notes, "showPersonalInfo", "hiddenCompanyIds", "hiddenProjectIds", "customOrder", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      presentation.id,
      presentation.userId,
      presentation.name,
      presentation.targetRole ?? null,
      presentation.targetCompany ?? null,
      presentation.notes ?? null,
      presentation.showPersonalInfo,
      JSON.stringify(presentation.hiddenCompanyIds),
      JSON.stringify(presentation.hiddenProjectIds),
      JSON.stringify(presentation.customOrder),
      presentation.createdAt,
      presentation.updatedAt
    ]);

    return presentation;
  },

  async update(id: string, data: UpdatePresentationDto): Promise<Presentation | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await pool.query(`
      UPDATE presentations 
      SET name = $1, "targetRole" = $2, "targetCompany" = $3, notes = $4, "hiddenCompanyIds" = $5, "hiddenProjectIds" = $6, "customOrder" = $7, "updatedAt" = $8
      WHERE id = $9
    `, [
      updated.name,
      updated.targetRole ?? null,
      updated.targetCompany ?? null,
      updated.notes ?? null,
      JSON.stringify(updated.hiddenCompanyIds),
      JSON.stringify(updated.hiddenProjectIds),
      JSON.stringify(updated.customOrder),
      updated.updatedAt,
      id
    ]);

    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM presentations WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  deserialize(row: any): Presentation {
    return {
      ...row,
      hiddenCompanyIds: JSON.parse(row.hiddenCompanyIds),
      hiddenProjectIds: JSON.parse(row.hiddenProjectIds),
      customOrder: JSON.parse(row.customOrder),
    };
  },
};
