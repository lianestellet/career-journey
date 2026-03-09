import { AppShell as MantineAppShell, NavLink, Group, Title, Box, Text, Avatar, Menu, ActionIcon } from '@mantine/core';
import { IconBriefcase, IconPresentation, IconHome, IconUser, IconLogout, IconSettings } from '@tabler/icons-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MantineAppShell
      header={{ height: 70 }}
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding="xl"
      styles={{
        main: {
          backgroundColor: '#fafbfc',
        },
        header: {
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
        navbar: {
          backgroundColor: 'white',
          borderRight: '1px solid #e9ecef',
        },
      }}
    >
      <MantineAppShell.Header>
        <Group h="100%" px="xl" justify="space-between">
          <Group>
            <Box
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
            >
              <IconPresentation size={24} color="white" />
            </Box>
            <Box>
              <Title 
                order={3} 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}
              >
                Career Timeline
              </Title>
              <Text size="xs" c="dimmed">Developer Portfolio</Text>
            </Box>
          </Group>

          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Group style={{ cursor: 'pointer' }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    radius="xl"
                    size="md"
                    color="violet"
                    style={{
                      border: '2px solid #9c27b0',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text size="sm" fw={600}>{user.name}</Text>
                    <Text size="xs" c="dimmed">{user.email}</Text>
                  </Box>
                </Group>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<IconUser size={16} />}
                  onClick={() => navigate('/profile')}
                >
                  Profile Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <NavLink
          label="Home"
          description="Welcome & Overview"
          leftSection={<IconHome size={20} />}
          active={location.pathname === '/'}
          onClick={() => navigate('/')}
          styles={{
            root: {
              borderRadius: '8px',
              marginBottom: '8px',
            },
          }}
        />
        <NavLink
          label="Your Journey"
          description="Companies & Projects"
          leftSection={<IconBriefcase size={20} />}
          active={location.pathname === '/companies'}
          onClick={() => navigate('/companies')}
          styles={{
            root: {
              borderRadius: '8px',
              marginBottom: '8px',
            },
          }}
        />
        <NavLink
          label="Presentations"
          description="Showcase Your Work"
          leftSection={<IconPresentation size={20} />}
          active={location.pathname === '/presentations'}
          onClick={() => navigate('/presentations')}
          styles={{
            root: {
              borderRadius: '8px',
              marginBottom: '8px',
            },
          }}
        />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
