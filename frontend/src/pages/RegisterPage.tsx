import { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Box,
  Alert,
} from '@mantine/core';
import { IconAlertCircle, IconUserPlus } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box style={{ width: '100%' }}>
        <Paper
          shadow="xl"
          p="xl"
          radius="lg"
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}
        >
          <Stack gap="lg">
            <Box style={{ textAlign: 'center' }}>
              <Title
                order={2}
                mb="xs"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Start Your Journey
              </Title>
              <Text c="dimmed">Create your developer portfolio</Text>
            </Box>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  size="md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  required
                  size="md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  size="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  required
                  size="md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                  leftSection={<IconUserPlus size={20} />}
                  loading={loading}
                  fullWidth
                >
                  Create Account
                </Button>
              </Stack>
            </form>

            <Text size="sm" ta="center">
              Already have an account?{' '}
              <Anchor href="/login" fw={600} c="violet">
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
