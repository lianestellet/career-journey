import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Button,
  Card,
  Text,
  Group,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
  MultiSelect,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconPresentation, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { presentationsApi, companiesApi, projectsApi } from '../services/api';
import type { Presentation, Company, Project, CreatePresentationDto } from '../types';

export function PresentationsPage() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Presentation | null>(null);

  const form = useForm<CreatePresentationDto>({
    initialValues: {
      name: '',
      targetRole: '',
      targetCompany: '',
      notes: '',
      hiddenCompanyIds: [],
      hiddenProjectIds: [],
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [presentationsData, companiesData, projectsData] = await Promise.all([
        presentationsApi.getAll(),
        companiesApi.getAll(),
        projectsApi.getAll(),
      ]);
      
      setPresentations(presentationsData);
      setCompanies(companiesData);
      setProjects(projectsData);
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

  const handleSave = async (values: CreatePresentationDto) => {
    try {
      if (editing) {
        await presentationsApi.update(editing.id, values);
        notifications.show({
          title: 'Success',
          message: 'Presentation updated successfully',
          color: 'green',
        });
      } else {
        await presentationsApi.create(values);
        notifications.show({
          title: 'Success',
          message: 'Presentation created successfully',
          color: 'green',
        });
      }
      setModalOpen(false);
      setEditing(null);
      form.reset();
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save presentation',
        color: 'red',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this presentation?')) return;
    
    try {
      await presentationsApi.delete(id);
      notifications.show({
        title: 'Success',
        message: 'Presentation deleted successfully',
        color: 'green',
      });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete presentation',
        color: 'red',
      });
    }
  };

  const openModal = (presentation?: Presentation) => {
    if (presentation) {
      setEditing(presentation);
      form.setValues({
        name: presentation.name,
        targetRole: presentation.targetRole || '',
        targetCompany: presentation.targetCompany || '',
        notes: presentation.notes || '',
        hiddenCompanyIds: presentation.hiddenCompanyIds,
        hiddenProjectIds: presentation.hiddenProjectIds,
      });
    } else {
      setEditing(null);
      form.reset();
    }
    setModalOpen(true);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const companyOptions = companies.map(c => ({ value: c.id, label: c.name }));
  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Interview Presentations</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => openModal()}>
          Create Presentation
        </Button>
      </Group>

      <Stack>
        {presentations.map((presentation) => (
          <Card key={presentation.id} withBorder>
            <Group justify="space-between">
              <Box style={{ flex: 1 }}>
                <Group mb="xs">
                  <IconPresentation size={20} />
                  <Text fw={500}>{presentation.name}</Text>
                </Group>
                {presentation.targetRole && (
                  <Text size="sm" c="dimmed">
                    Target Role: {presentation.targetRole}
                  </Text>
                )}
                {presentation.targetCompany && (
                  <Text size="sm" c="dimmed">
                    Target Company: {presentation.targetCompany}
                  </Text>
                )}
              </Box>
              <Group gap="xs">
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconEye size={16} />}
                  onClick={() => navigate(`/presentation/${presentation.id}`)}
                >
                  Present
                </Button>
                <ActionIcon variant="subtle" onClick={() => openModal(presentation)}>
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => handleDelete(presentation.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          form.reset();
        }}
        title={editing ? 'Edit Presentation' : 'Create Presentation'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack>
            <TextInput
              label="Presentation Name"
              required
              placeholder="e.g., Senior Frontend Developer at Acme Corp"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Target Role"
              placeholder="e.g., Senior Frontend Developer"
              {...form.getInputProps('targetRole')}
            />
            <TextInput
              label="Target Company"
              placeholder="e.g., Acme Corp"
              {...form.getInputProps('targetCompany')}
            />
            <Textarea
              label="Notes"
              placeholder="Additional notes for this presentation"
              minRows={2}
              {...form.getInputProps('notes')}
            />
            <MultiSelect
              label="Hidden Companies"
              description="Select companies to hide from this presentation"
              data={companyOptions}
              searchable
              {...form.getInputProps('hiddenCompanyIds')}
            />
            <MultiSelect
              label="Hidden Projects"
              description="Select projects to hide from this presentation"
              data={projectOptions}
              searchable
              {...form.getInputProps('hiddenProjectIds')}
            />
            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={() => {
                  setModalOpen(false);
                  setEditing(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editing ? 'Update' : 'Create'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
