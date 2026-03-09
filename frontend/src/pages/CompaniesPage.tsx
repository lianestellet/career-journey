import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Button,
  Card,
  Text,
  Group,
  Badge,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
  Box,
  Timeline,
  ThemeIcon,
  Paper,
  Container,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconBriefcase, 
  IconMapPin, 
  IconCalendar,
  IconSparkles,
  IconCode,
  IconBrandLinkedin,
} from '@tabler/icons-react';
import { companiesApi, projectsApi } from '../services/api';
import type { Company, Project, CreateCompanyDto } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { parseLinkedInExperience } from '../utils/linkedinParser';

const techColors: Record<string, string> = {
  react: '#61DAFB',
  typescript: '#3178C6',
  nodejs: '#339933',
  python: '#3776AB',
  aws: '#FF9900',
  docker: '#2496ED',
  kubernetes: '#326CE5',
  postgresql: '#4169E1',
  mongodb: '#47A248',
  default: '#9c27b0',
};

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Record<string, Project[]>>({});
  const [loading, setLoading] = useState(true);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [linkedInImportOpen, setLinkedInImportOpen] = useState(false);
  const [linkedInText, setLinkedInText] = useState('');

  const companyForm = useForm<CreateCompanyDto>({
    initialValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      role: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companiesData, projectsData] = await Promise.all([
        companiesApi.getAll(),
        projectsApi.getAll(),
      ]);
      
      setCompanies(companiesData);
      
      const projectsByCompany: Record<string, Project[]> = {};
      projectsData.forEach(project => {
        if (!projectsByCompany[project.companyId]) {
          projectsByCompany[project.companyId] = [];
        }
        projectsByCompany[project.companyId].push(project);
      });
      setProjects(projectsByCompany);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (values: CreateCompanyDto) => {
    try {
      if (editingCompany) {
        await companiesApi.update(editingCompany.id, values);
        notifications.show({
          title: 'Success',
          message: 'Company updated successfully',
          color: 'green',
        });
      } else {
        await companiesApi.create(values);
        notifications.show({
          title: 'Success',
          message: 'Company created successfully',
          color: 'green',
        });
      }
      setCompanyModalOpen(false);
      setEditingCompany(null);
      companyForm.reset();
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save company',
        color: 'red',
      });
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company and all its projects?')) return;
    
    try {
      await companiesApi.delete(id);
      notifications.show({
        title: 'Success',
        message: 'Company deleted successfully',
        color: 'green',
      });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete company',
        color: 'red',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsApi.delete(id);
      notifications.show({
        title: 'Success',
        message: 'Project deleted successfully',
        color: 'green',
      });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete project',
        color: 'red',
      });
    }
  };

  const openCompanyModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      companyForm.setValues(company);
    } else {
      setEditingCompany(null);
      companyForm.reset();
    }
    setCompanyModalOpen(true);
  };

  const openProjectModal = (companyId: string, project?: Project) => {
    setSelectedCompanyId(companyId);
    setEditingProject(project || null);
    setProjectModalOpen(true);
  };

  const handleLinkedInImport = () => {
    const parsed = parseLinkedInExperience(linkedInText);
    
    if (!parsed) {
      notifications.show({
        title: 'Parse Error',
        message: 'Could not parse LinkedIn data. Please check the format and try again.',
        color: 'red',
      });
      return;
    }
    
    // Populate the form with parsed data
    companyForm.setValues({
      name: parsed.name,
      role: parsed.role,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      location: parsed.location,
      description: parsed.description,
    });
    
    // Close LinkedIn import modal and open company modal
    setLinkedInImportOpen(false);
    setLinkedInText('');
    setCompanyModalOpen(true);
    
    notifications.show({
      title: 'Success',
      message: 'LinkedIn data imported! Review and save your experience.',
      color: 'green',
    });
  };

  if (loading) {
    return <Text>Loading your journey...</Text>;
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Box>
          <Group justify="space-between" mb="md">
            <Box>
              <Title 
                order={1}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                }}
              >
                Your Professional Journey
              </Title>
              <Text size="lg" c="dimmed" mt="xs">
                Every experience shapes who you are today
              </Text>
            </Box>
            <Button 
              size="lg"
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape', deg: 45 }}
              leftSection={<IconPlus size={20} />}
              onClick={() => openCompanyModal()}
            >
              Add Experience
            </Button>
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button
              variant="light"
              color="blue"
              leftSection={<IconBrandLinkedin size={18} />}
              onClick={() => setLinkedInImportOpen(true)}
            >
              Import from LinkedIn
            </Button>
          </Group>
          <Divider 
            size="sm"
            styles={{
              root: {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '3px',
                borderRadius: '2px',
              },
            }}
          />
        </Box>

        <Timeline 
          active={companies.length} 
          bulletSize={32} 
          lineWidth={3}
          styles={{
            itemBullet: {
              borderWidth: 3,
            },
          }}
        >
          {companies.map((company, index) => (
            <Timeline.Item
              key={company.id}
              bullet={
                <ThemeIcon
                  size={32}
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'grape', deg: index * 45 }}
                  radius="xl"
                >
                  <IconBriefcase size={18} />
                </ThemeIcon>
              }
            >
              <Paper
                shadow="md"
                p="xl"
                radius="lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                className="card-hover"
              >
                <Stack gap="md">
                  <Group justify="space-between" wrap="nowrap">
                    <Box style={{ flex: 1 }}>
                      <Group gap="sm" mb="xs">
                        <Title order={3}>{company.name}</Title>
                        <Badge 
                          size="lg"
                          variant="gradient"
                          gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                        >
                          {company.endDate ? 'Past' : 'Current'}
                        </Badge>
                      </Group>
                      <Text size="lg" fw={600} c="violet">{company.role}</Text>
                    </Box>
                    <Group gap="xs">
                      <ActionIcon
                        size="lg"
                        variant="light"
                        color="violet"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCompanyModal(company);
                        }}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon
                        size="lg"
                        variant="light"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCompany(company.id);
                        }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Group gap="lg">
                    <Group gap="xs">
                      <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
                      <Text size="sm" c="dimmed">
                        {company.startDate} - {company.endDate || 'Present'}
                      </Text>
                    </Group>
                    {company.location && (
                      <Group gap="xs">
                        <IconMapPin size={16} color="var(--mantine-color-dimmed)" />
                        <Text size="sm" c="dimmed">{company.location}</Text>
                      </Group>
                    )}
                  </Group>

                  <Text size="md" style={{ lineHeight: 1.7 }}>
                    {company.description}
                  </Text>

                  <Divider my="sm" />

                  <Box>
                    <Group justify="space-between" mb="md">
                      <Group gap="xs">
                        <IconSparkles size={20} color="#9c27b0" />
                        <Text fw={600} size="lg">Projects & Achievements</Text>
                      </Group>
                      <Button
                        size="sm"
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openProjectModal(company.id);
                        }}
                      >
                        Add Project
                      </Button>
                    </Group>

                    {projects[company.id]?.length > 0 ? (
                      <Stack gap="md">
                        {projects[company.id].map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={() => openProjectModal(company.id, project)}
                            onDelete={() => handleDeleteProject(project.id)}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Card 
                        withBorder 
                        radius="md" 
                        p="xl"
                        style={{
                          background: 'rgba(156, 39, 176, 0.05)',
                          borderStyle: 'dashed',
                          borderColor: 'rgba(156, 39, 176, 0.3)',
                        }}
                      >
                        <Stack align="center" gap="xs">
                          <IconCode size={32} color="rgba(156, 39, 176, 0.5)" />
                          <Text size="sm" c="dimmed" ta="center">
                            No projects yet. Add your first project to showcase your work!
                          </Text>
                        </Stack>
                      </Card>
                    )}
                  </Box>
                </Stack>
              </Paper>
            </Timeline.Item>
          ))}
        </Timeline>

        {companies.length === 0 && (
          <Card 
            shadow="md" 
            p="xl" 
            radius="lg"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.3)',
              textAlign: 'center',
            }}
          >
            <Stack align="center" gap="lg">
              <ThemeIcon size={80} radius="xl" variant="gradient" gradient={{ from: 'violet', to: 'grape' }}>
                <IconBriefcase size={40} />
              </ThemeIcon>
              <Box>
                <Title order={3} mb="xs">Start Your Journey</Title>
                <Text size="lg" c="dimmed" maw={500}>
                  Add your first company to begin building your professional story.
                  Every great career starts with a single step!
                </Text>
              </Box>
              <Button 
                size="lg" 
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                leftSection={<IconPlus size={20} />}
                onClick={() => openCompanyModal()}
              >
                Add Your First Experience
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>

      <Modal
        opened={companyModalOpen}
        onClose={() => {
          setCompanyModalOpen(false);
          setEditingCompany(null);
          companyForm.reset();
        }}
        title={<Title order={3}>{editingCompany ? 'Edit Experience' : 'Add New Experience'}</Title>}
        size="lg"
      >
        <form onSubmit={companyForm.onSubmit(handleSaveCompany)}>
          <Stack>
            <TextInput
              label="Company Name"
              placeholder="Where did you work?"
              required
              size="md"
              {...companyForm.getInputProps('name')}
            />
            <TextInput
              label="Your Role"
              placeholder="What was your position?"
              required
              size="md"
              {...companyForm.getInputProps('role')}
            />
            <Textarea
              label="Description"
              placeholder="Tell your story... What did you do? What impact did you make?"
              required
              minRows={4}
              size="md"
              {...companyForm.getInputProps('description')}
            />
            <TextInput
              label="Location"
              placeholder="Where was this?"
              size="md"
              {...companyForm.getInputProps('location')}
            />
            <Group grow>
              <TextInput
                label="Start Date"
                type="month"
                required
                size="md"
                {...companyForm.getInputProps('startDate')}
              />
              <TextInput
                label="End Date"
                type="month"
                placeholder="Leave empty if current"
                size="md"
                {...companyForm.getInputProps('endDate')}
              />
            </Group>
            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={() => {
                  setCompanyModalOpen(false);
                  setEditingCompany(null);
                  companyForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape', deg: 45 }}
              >
                {editingCompany ? 'Update Experience' : 'Add Experience'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {selectedCompanyId && (
        <ProjectModal
          opened={projectModalOpen}
          onClose={() => {
            setProjectModalOpen(false);
            setSelectedCompanyId(null);
            setEditingProject(null);
          }}
          companyId={selectedCompanyId}
          project={editingProject}
          onSave={loadData}
        />
      )}

      <Modal
        opened={linkedInImportOpen}
        onClose={() => {
          setLinkedInImportOpen(false);
          setLinkedInText('');
        }}
        title={
          <Group gap="xs">
            <IconBrandLinkedin size={24} color="#0077B5" />
            <Title order={3}>Import from LinkedIn</Title>
          </Group>
        }
        size="lg"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Copy and paste your LinkedIn experience details here. Include the company name, role, 
            dates, location, and description. The system will automatically parse and fill the form.
          </Text>
          
          <Box
            p="md"
            style={{
              background: 'rgba(0, 119, 181, 0.05)',
              border: '1px solid rgba(0, 119, 181, 0.2)',
              borderRadius: '8px',
            }}
          >
            <Text size="xs" fw={600} mb="xs" c="blue">EXAMPLE FORMAT:</Text>
            <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
              {`Senior Software Engineer
Acme Corporation
Jan 2020 - Present
San Francisco, CA
Led development of microservices architecture...`}
            </Text>
          </Box>

          <Textarea
            placeholder="Paste your LinkedIn experience here..."
            minRows={8}
            value={linkedInText}
            onChange={(e) => setLinkedInText(e.target.value)}
            styles={{
              input: {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              },
            }}
          />

          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                setLinkedInImportOpen(false);
                setLinkedInText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              leftSection={<IconBrandLinkedin size={18} />}
              onClick={handleLinkedInImport}
              disabled={!linkedInText.trim()}
            >
              Parse & Import
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
