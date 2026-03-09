import { Router } from 'express';
import { companyDb } from '../db/companies.js';
import type { CreateCompanyDto, UpdateCompanyDto } from '../types/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

export const companiesRouter = Router();

companiesRouter.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const companies = await companyDb.getAll(req.userId);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

companiesRouter.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const company = await companyDb.getById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

companiesRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data: CreateCompanyDto = req.body;
    const company = await companyDb.create(data, req.userId!);
    res.status(201).json(company);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

companiesRouter.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data: UpdateCompanyDto = req.body;
    const company = await companyDb.update(req.params.id, data);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company' });
  }
});

companiesRouter.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const success = await companyDb.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

companiesRouter.patch('/:id/order', authenticate, async (req: AuthRequest, res) => {
  try {
    const { order } = req.body;
    const success = await companyDb.updateOrder(req.params.id, order);
    if (!success) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company order' });
  }
});
