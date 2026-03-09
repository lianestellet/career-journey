import { Router } from 'express';
import { projectDb } from '../db/projects.js';
import type { CreateProjectDto, UpdateProjectDto } from '../types/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

export const projectsRouter = Router();

projectsRouter.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { companyId } = req.query;
    const projects = companyId 
      ? await projectDb.getByCompanyId(companyId as string)
      : await projectDb.getAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

projectsRouter.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await projectDb.getById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

projectsRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data: CreateProjectDto = req.body;
    const project = await projectDb.create(data);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

projectsRouter.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data: UpdateProjectDto = req.body;
    const project = await projectDb.update(req.params.id, data);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

projectsRouter.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const success = await projectDb.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

projectsRouter.patch('/:id/order', authenticate, async (req: AuthRequest, res) => {
  try {
    const { order } = req.body;
    const success = await projectDb.updateOrder(req.params.id, order);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project order' });
  }
});
