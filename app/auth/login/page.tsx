'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch, storeSession } from '@/lib/api';
import type { AuthResponse } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const data = await apiFetch<AuthResponse>(
        '/auth/login',
        { method: 'POST', json: { email, password } }
      );
      storeSession(data);
      setMessage({ type: 'success', text: 'Inicio de sesión exitoso. Redirigiendo…' });
      setTimeout(() => router.push('/events'), 1200);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card>
        <CardContent sx={{ p: { xs: 4, md: 6 } }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Bienvenido de nuevo
              </Typography>
              <Typography color="text.secondary">
                Iniciá sesión para gestionar tus tickets y eventos favoritos.
              </Typography>
            </Box>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
              <FormControlLabel control={<Checkbox />} label="Recordarme" />
              <Link href="#" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </Stack>
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? 'Iniciando…' : 'Iniciar sesión'}
            </Button>
            <Typography textAlign="center">
              ¿No tenés cuenta?{' '}
              <Link href="/auth/register" underline="hover">
                Crear cuenta
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
