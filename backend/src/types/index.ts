export interface Company {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  role: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string;
  industry?: string;
  technologies: string[];
  keywords: string[];
  architectureDiagrams: string[];
  startDate?: string;
  endDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Presentation {
  id: string;
  name: string;
  targetRole?: string;
  targetCompany?: string;
  notes?: string;
  hiddenCompanyIds: string[];
  hiddenProjectIds: string[];
  customOrder: {
    companyId: string;
    projectIds: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  role: string;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

export interface CreateProjectDto {
  companyId: string;
  name: string;
  description: string;
  industry?: string;
  technologies: string[];
  keywords: string[];
  architectureDiagrams: string[];
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectDto extends Partial<Omit<CreateProjectDto, 'companyId'>> {}

export interface CreatePresentationDto {
  name: string;
  targetRole?: string;
  targetCompany?: string;
  notes?: string;
  hiddenCompanyIds?: string[];
  hiddenProjectIds?: string[];
  customOrder?: {
    companyId: string;
    projectIds: string[];
  }[];
}

export interface UpdatePresentationDto extends Partial<CreatePresentationDto> {}
