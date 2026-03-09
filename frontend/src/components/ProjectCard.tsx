import { Card, Text, Group, Badge, Stack, ActionIcon, Box, ThemeIcon } from '@mantine/core';
import { IconEdit, IconTrash, IconTrophy, IconCalendar } from '@tabler/icons-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const techColorMap: Record<string, { color: string; bg: string }> = {
  react: { color: '#61DAFB', bg: 'rgba(97, 218, 251, 0.1)' },
  typescript: { color: '#3178C6', bg: 'rgba(49, 120, 198, 0.1)' },
  nodejs: { color: '#339933', bg: 'rgba(51, 153, 51, 0.1)' },
  'node.js': { color: '#339933', bg: 'rgba(51, 153, 51, 0.1)' },
  python: { color: '#3776AB', bg: 'rgba(55, 118, 171, 0.1)' },
  aws: { color: '#FF9900', bg: 'rgba(255, 153, 0, 0.1)' },
  docker: { color: '#2496ED', bg: 'rgba(36, 150, 237, 0.1)' },
  kubernetes: { color: '#326CE5', bg: 'rgba(50, 108, 229, 0.1)' },
  postgresql: { color: '#4169E1', bg: 'rgba(65, 105, 225, 0.1)' },
  mongodb: { color: '#47A248', bg: 'rgba(71, 162, 72, 0.1)' },
  express: { color: '#000000', bg: 'rgba(0, 0, 0, 0.1)' },
  graphql: { color: '#E10098', bg: 'rgba(225, 0, 152, 0.1)' },
  'next.js': { color: '#000000', bg: 'rgba(0, 0, 0, 0.1)' },
  vue: { color: '#4FC08D', bg: 'rgba(79, 192, 141, 0.1)' },
  angular: { color: '#DD0031', bg: 'rgba(221, 0, 49, 0.1)' },
};

function getTechStyle(tech: string) {
  const key = tech.toLowerCase();
  return techColorMap[key] || { color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.1)' };
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      style={{
        background: 'white',
        border: '1px solid rgba(102, 126, 234, 0.15)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      className="card-hover"
    >
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" style={{ flex: 1 }}>
            <ThemeIcon 
              size="xl" 
              radius="md"
              variant="gradient"
              gradient={{ from: 'cyan', to: 'indigo', deg: 45 }}
            >
              <IconTrophy size={20} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Text fw={600} size="lg">{project.name}</Text>
              {project.industry && (
                <Text size="xs" c="dimmed">{project.industry}</Text>
              )}
            </Box>
          </Group>
          <Group gap="xs">
            <ActionIcon 
              variant="light" 
              color="violet"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <IconEdit size={18} />
            </ActionIcon>
            <ActionIcon 
              variant="light" 
              color="red"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Group>

        <Text size="sm" style={{ lineHeight: 1.6 }}>
          {project.description}
        </Text>

        {(project.startDate || project.endDate) && (
          <Group gap="xs">
            <IconCalendar size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed">
              {project.startDate} {project.endDate && `- ${project.endDate}`}
            </Text>
          </Group>
        )}

        {project.technologies.length > 0 && (
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb="xs">TECH STACK</Text>
            <Group gap="xs">
              {project.technologies.map((tech, i) => {
                const style = getTechStyle(tech);
                return (
                  <Badge
                    key={i}
                    size="md"
                    radius="sm"
                    style={{
                      backgroundColor: style.bg,
                      color: style.color,
                      border: `1px solid ${style.color}40`,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    {tech}
                  </Badge>
                );
              })}
            </Group>
          </Box>
        )}

        {project.keywords.length > 0 && (
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb="xs">KEY HIGHLIGHTS</Text>
            <Group gap="xs">
              {project.keywords.map((keyword, i) => (
                <Badge
                  key={i}
                  size="sm"
                  variant="light"
                  color="violet"
                  radius="sm"
                  style={{
                    textTransform: 'none',
                  }}
                >
                  {keyword}
                </Badge>
              ))}
            </Group>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
