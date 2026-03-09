import pool from './index.js';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types/index.js';
import { randomUUID } from 'crypto';

export const projectDb = {
  async getAll(): Promise<Project[]> {
    const result = await pool.query('SELECT * FROM projects ORDER BY "order" ASC');
    return result.rows.map(row => this.deserialize(row));
  },

  async getByCompanyId(companyId: string): Promise<Project[]> {
    const result = await pool.query('SELECT * FROM projects WHERE "companyId" = $1 ORDER BY "order" ASC', [companyId]);
    return result.rows.map(row => this.deserialize(row));
  },

  async getById(id: string): Promise<Project | undefined> {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] ? this.deserialize(result.rows[0]) : undefined;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const maxOrderResult = await pool.query('SELECT MAX("order") as "maxOrder" FROM projects WHERE "companyId" = $1', [data.companyId]);
    const order = (maxOrderResult.rows[0]?.maxOrder ?? -1) + 1;

    const project: Project = {
      id,
      ...data,
      order,
      createdAt: now,
      updatedAt: now,
    };

    await pool.query(`
      INSERT INTO projects (id, "companyId", name, description, industry, technologies, keywords, "architectureDiagrams", "startDate", "endDate", "order", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
      project.id,
      project.companyId,
      project.name,
      project.description,
      project.industry ?? null,
      JSON.stringify(project.technologies),
      JSON.stringify(project.keywords),
      JSON.stringify(project.architectureDiagrams),
      project.startDate ?? null,
      project.endDate ?? null,
      project.order,
      project.createdAt,
      project.updatedAt
    ]);

    return project;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await pool.query(`
      UPDATE projects 
      SET name = $1, description = $2, industry = $3, technologies = $4, keywords = $5, "architectureDiagrams" = $6, "startDate" = $7, "endDate" = $8, "updatedAt" = $9
      WHERE id = $10
    `, [
      updated.name,
      updated.description,
      updated.industry ?? null,
      JSON.stringify(updated.technologies),
      JSON.stringify(updated.keywords),
      JSON.stringify(updated.architectureDiagrams),
      updated.startDate ?? null,
      updated.endDate ?? null,
      updated.updatedAt,
      id
    ]);

    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  async updateOrder(id: string, newOrder: number): Promise<boolean> {
    const result = await pool.query('UPDATE projects SET "order" = $1 WHERE id = $2', [newOrder, id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  deserialize(row: any): Project {
    return {
      ...row,
      technologies: JSON.parse(row.technologies),
      keywords: JSON.parse(row.keywords),
      architectureDiagrams: JSON.parse(row.architectureDiagrams),
    };
  },
};
