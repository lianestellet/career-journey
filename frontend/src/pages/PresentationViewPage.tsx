import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  Box,
  Image,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { presentationsApi } from '../services/api';
import type { PresentationView } from '../types';

export function PresentationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PresentationView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPresentation();
    }
  }, [id]);

  const loadPresentation = async () => {
    try {
      setLoading(true);
      const presentationData = await presentationsApi.getView(id!);
      setData(presentationData);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load presentation',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container size="xl" py="xl">
        <Text>Presentation not found</Text>
      </Container>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }} p="xl">
      <Container size="xl">
        <Stack gap="xl">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/presentations')}
            >
              Back to Presentations
            </Button>
          </Group>

          <Box>
            <Title order={1} mb="xs">
              {data.presentation.name}
            </Title>
            {data.presentation.targetRole && (
              <Text size="lg" c="dimmed">
                {data.presentation.targetRole}
              </Text>
            )}
            {data.presentation.targetCompany && (
              <Text size="lg" c="dimmed">
                at {data.presentation.targetCompany}
              </Text>
            )}
            {data.presentation.notes && (
              <Text size="sm" mt="md" c="dimmed">
                {data.presentation.notes}
              </Text>
            )}
          </Box>

          <Divider />

          {data.companies.map((company) => (
            <Card key={company.id} shadow="sm" padding="xl" radius="md" withBorder>
              <Stack gap="md">
                <Box>
                  <Group justify="space-between" mb="xs">
                    <Title order={2}>{company.name}</Title>
                    <Text c="dimmed">
                      {company.startDate}
                      {company.endDate ? ` - ${company.endDate}` : ' - Present'}
                    </Text>
                  </Group>
                  <Text fw={500} size="lg" mb="xs">
                    {company.role}
                  </Text>
                  {company.location && (
                    <Text size="sm" c="dimmed" mb="sm">
                      {company.location}
                    </Text>
                  )}
                  <Text>{company.description}</Text>
                </Box>

                {company.projects.length > 0 && (
                  <Stack gap="lg" mt="md">
                    <Title order={3}>Projects</Title>
                    {company.projects.map((project) => (
                      <Card key={project.id} withBorder padding="lg">
                        <Stack gap="sm">
                          <Title order={4}>{project.name}</Title>
                          
                          {project.industry && (
                            <Text size="sm" c="dimmed">
                              Industry: {project.industry}
                            </Text>
                          )}

                          <Text>{project.description}</Text>

                          {project.technologies.length > 0 && (
                            <Box>
                              <Text size="sm" fw={500} mb="xs">
                                Technologies:
                              </Text>
                              <Group gap="xs">
                                {project.technologies.map((tech, i) => (
                                  <Badge key={i} size="lg" variant="light">
                                    {tech}
                                  </Badge>
                                ))}
                              </Group>
                            </Box>
                          )}

                          {project.keywords.length > 0 && (
                            <Box>
                              <Text size="sm" fw={500} mb="xs">
                                Keywords:
                              </Text>
                              <Group gap="xs">
                                {project.keywords.map((keyword, i) => (
                                  <Badge key={i} size="md" variant="outline" color="gray">
                                    {keyword}
                                  </Badge>
                                ))}
                              </Group>
                            </Box>
                          )}

                          {project.architectureDiagrams.length > 0 && (
                            <Box>
                              <Text size="sm" fw={500} mb="xs">
                                Architecture Diagrams:
                              </Text>
                              <Group gap="md">
                                {project.architectureDiagrams.map((url, i) => (
                                  <Image
                                    key={i}
                                    src={url}
                                    alt={`Architecture diagram ${i + 1}`}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                  />
                                ))}
                              </Group>
                            </Box>
                          )}
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
