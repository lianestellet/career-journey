import { Router } from 'express';
import { presentationDb } from '../db/presentations.js';
import { companyDb } from '../db/companies.js';
import { projectDb } from '../db/projects.js';
import type { CreatePresentationDto, UpdatePresentationDto } from '../types/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

export const presentationsRouter = Router();

presentationsRouter.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const presentations = await presentationDb.getAll(req.userId);
    res.json(presentations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch presentations' });
  }
});

presentationsRouter.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const presentation = await presentationDb.getById(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.json(presentation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch presentation' });
  }
});

presentationsRouter.get('/:id/view', authenticate, async (req: AuthRequest, res) => {
  try {
    const presentation = await presentationDb.getById(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    const allCompanies = await companyDb.getAll(req.userId);
    const allProjects = await projectDb.getAll();

    const visibleCompanies = allCompanies
      .filter(c => !presentation.hiddenCompanyIds.includes(c.id))
      .map(company => {
        const companyProjects = allProjects
          .filter(p => p.companyId === company.id && !presentation.hiddenProjectIds.includes(p.id));
        
        return {
          ...company,
          projects: companyProjects,
        };
      });

    if (presentation.customOrder.length > 0) {
      const ordered = presentation.customOrder
        .map(orderItem => {
          const company = visibleCompanies.find(c => c.id === orderItem.companyId);
          if (!company) return null;

          if (orderItem.projectIds.length > 0) {
            const orderedProjects = orderItem.projectIds
              .map(pid => company.projects.find(p => p.id === pid))
              .filter(p => p !== undefined);
            
            return {
              ...company,
              projects: orderedProjects,
            };
          }

          return company;
        })
        .filter(c => c !== null);

      res.json({
        presentation,
        companies: ordered,
      });
    } else {
      res.json({
        presentation,
        companies: visibleCompanies,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch presentation view' });
  }
});

presentationsRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data: CreatePresentationDto = req.body;
    const presentation = await presentationDb.create(data, req.userId!);
    res.status(201).json(presentation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create presentation' });
  }
});

presentationsRouter.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data: UpdatePresentationDto = req.body;
    const presentation = await presentationDb.update(req.params.id, data);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.json(presentation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update presentation' });
  }
});

presentationsRouter.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const success = await presentationDb.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete presentation' });
  }
});
