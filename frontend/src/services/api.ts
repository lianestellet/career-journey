import type {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  Presentation,
  CreatePresentationDto,
  UpdatePresentationDto,
  PresentationView,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export const companiesApi = {
  getAll: () =>
    fetch(`${API_BASE_URL}/companies`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Company[]>),

  getById: (id: string) =>
    fetch(`${API_BASE_URL}/companies/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Company>),

  create: (data: CreateCompanyDto) =>
    fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<Company>),

  update: (id: string, data: UpdateCompanyDto) =>
    fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<Company>),

  delete: (id: string) =>
    fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse<void>),

  updateOrder: (id: string, order: number) =>
    fetch(`${API_BASE_URL}/companies/${id}/order`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order }),
    }).then(handleResponse<void>),
};

export const projectsApi = {
  getAll: (companyId?: string) => {
    const url = companyId
      ? `${API_BASE_URL}/projects?companyId=${companyId}`
      : `${API_BASE_URL}/projects`;
    return fetch(url, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Project[]>);
  },

  getById: (id: string) =>
    fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Project>),

  create: (data: CreateProjectDto) =>
    fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<Project>),

  update: (id: string, data: UpdateProjectDto) =>
    fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<Project>),

  delete: (id: string) =>
    fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse<void>),

  updateOrder: (id: string, order: number) =>
    fetch(`${API_BASE_URL}/projects/${id}/order`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order }),
    }).then(handleResponse<void>),
};

export const presentationsApi = {
  getAll: () =>
    fetch(`${API_BASE_URL}/presentations`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Presentation[]>),

  getById: (id: string) =>
    fetch(`${API_BASE_URL}/presentations/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Presentation>),

  getView: (id: string) =>
    fetch(`${API_BASE_URL}/presentations/${id}/view`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<PresentationView>),

  create: (data: CreatePresentationDto) =>
    fetch(`${API_BASE_URL}/presentations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<Presentation>),

  update: (id: string, data: UpdatePresentationDto) =>
    fetch(`${API_BASE_URL}/presentations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<Presentation>),

  delete: (id: string) =>
    fetch(`${API_BASE_URL}/presentations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse<void>),
};
