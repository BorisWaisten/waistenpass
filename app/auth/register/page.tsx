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
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    setMessage(null);
    setLoading(true);
    try {
      await apiFetch('/users', {
        method: 'POST',
        json: {
          email: form.email,
          password: form.password,
          role: form.role
        }
      });
      setMessage({ type: 'success', text: 'Cuenta creada con éxito. Redirigiendo…' });
      setTimeout(() => router.push('/auth/login'), 1500);
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
                Creá tu cuenta
              </Typography>
              <Typography color="text.secondary">
                Descubrí eventos increíbles y guardá tus favoritos.
              </Typography>
            </Box>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={form.firstName}
                  onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                />
                <TextField
                  label="Apellido"
                  fullWidth
                  value={form.lastName}
                  onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </Stack>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
              <TextField
                label="Confirmar contraseña"
                type="password"
                fullWidth
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <TextField
                label="Tipo de usuario"
                select
                fullWidth
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="attendee">Quiero comprar tickets</MenuItem>
                <MenuItem value="organizer">Soy organizador</MenuItem>
              </TextField>
            </Stack>
            <FormControlLabel control={<Checkbox />} label="Acepto los términos y condiciones" />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? 'Creando cuenta…' : 'Registrarme'}
            </Button>
            <Typography textAlign="center">
              ¿Ya tenés cuenta?{' '}
              <Link href="/auth/login" underline="hover">
                Iniciá sesión
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
