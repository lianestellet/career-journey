import { Modal, Stack, TextInput, Textarea, Button, Group, TagsInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { projectsApi } from '../services/api';
import type { Project, CreateProjectDto } from '../types';

interface ProjectModalProps {
  opened: boolean;
  onClose: () => void;
  companyId: string;
  project: Project | null;
  onSave: () => void;
}

export function ProjectModal({ opened, onClose, companyId, project, onSave }: ProjectModalProps) {
  const form = useForm<Omit<CreateProjectDto, 'companyId'>>({
    initialValues: {
      name: '',
      description: '',
      industry: '',
      technologies: [],
      keywords: [],
      architectureDiagrams: [],
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (project) {
      form.setValues({
        name: project.name,
        description: project.description,
        industry: project.industry || '',
        technologies: project.technologies,
        keywords: project.keywords,
        architectureDiagrams: project.architectureDiagrams,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
      });
    } else {
      form.reset();
    }
  }, [project, opened]);

  const handleSubmit = async (values: Omit<CreateProjectDto, 'companyId'>) => {
    try {
      const data: CreateProjectDto = {
        ...values,
        companyId,
      };

      if (project) {
        await projectsApi.update(project.id, data);
        notifications.show({
          title: 'Success',
          message: 'Project updated successfully',
          color: 'green',
        });
      } else {
        await projectsApi.create(data);
        notifications.show({
          title: 'Success',
          message: 'Project created successfully',
          color: 'green',
        });
      }

      onSave();
      onClose();
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save project',
        color: 'red',
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add Project'}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Project Name"
            required
            {...form.getInputProps('name')}
          />
          <Textarea
            label="Description"
            required
            minRows={3}
            {...form.getInputProps('description')}
          />
          <TextInput
            label="Industry"
            {...form.getInputProps('industry')}
          />
          <TagsInput
            label="Technologies"
            placeholder="Press Enter to add"
            {...form.getInputProps('technologies')}
          />
          <TagsInput
            label="Keywords"
            placeholder="Press Enter to add"
            {...form.getInputProps('keywords')}
          />
          <TagsInput
            label="Architecture Diagram URLs"
            placeholder="Press Enter to add"
            {...form.getInputProps('architectureDiagrams')}
          />
          <Group grow>
            <TextInput
              label="Start Date"
              type="month"
              {...form.getInputProps('startDate')}
            />
            <TextInput
              label="End Date"
              type="month"
              placeholder="Leave empty if ongoing"
              {...form.getInputProps('endDate')}
            />
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
