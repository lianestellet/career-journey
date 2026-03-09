import { Container, Title, Text, Button, Stack, Group, Box } from '@mantine/core';
import { IconSparkles, IconRocket, IconHeart } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container size="lg">
        <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
          <Box
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              padding: '2rem',
              display: 'inline-flex',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <IconSparkles size={48} color="white" />
          </Box>

          <Title 
            order={1} 
            size="4rem"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
            }}
          >
            Your Career Story,
            <br />
            Beautifully Told
          </Title>

          <Text size="xl" c="dimmed" maw={600} style={{ lineHeight: 1.6 }}>
            Create stunning presentations of your professional journey. 
            Build a living portfolio that showcases your experience, projects, 
            and achievements in a way that truly represents you.
          </Text>

          <Group mt="xl">
            <Button 
              size="xl" 
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape', deg: 45 }}
              leftSection={<IconRocket size={24} />}
              onClick={() => navigate('/companies')}
              style={{ 
                fontSize: '1.1rem',
                padding: '1.5rem 2.5rem',
                height: 'auto',
              }}
            >
              Start Building Your Story
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              leftSection={<IconHeart size={24} />}
              onClick={() => navigate('/presentations')}
              style={{ 
                fontSize: '1.1rem',
                padding: '1.5rem 2.5rem',
                height: 'auto',
              }}
            >
              View Presentations
            </Button>
          </Group>

          <Box mt="xl" style={{ opacity: 0.7 }}>
            <Text size="sm" c="dimmed">
              ✨ Designed for developers, by developers
            </Text>
          </Box>
        </Stack>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}</style>
      </Container>
    </Box>
  );
}
