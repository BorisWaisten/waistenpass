'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useState, useMemo } from 'react';
import { useTickets } from '@/lib/hooks/useTickets';
import { useEvents } from '@/lib/hooks/useEvents';
import { getStoredUser } from '@/lib/api';
import { TicketDTO } from '@/lib/types';
import Link from 'next/link';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString));
}

function formatCurrency(value: number | undefined, currency: string | undefined) {
  if (value === undefined || value === null || currency === undefined) {
    return 'Precio no disponible';
  }
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export default function ProfilePage() {
  const user = getStoredUser();
  const { tickets, loading: ticketsLoading } = useTickets(user?.id);
  const { events } = useEvents();
  const [tab, setTab] = useState(0);

  const ticketsWithEvents = useMemo(() => {
    return tickets.map((ticket) => {
      const event = events.find((e) => e.id === ticket.eventId);
      return { ticket, event };
    });
  }, [tickets, events]);

  const purchases = useMemo(() => {
    const grouped = ticketsWithEvents.reduce((acc, { ticket, event }) => {
      const key = `${ticket.eventId}-${new Date(ticket.issuedAt).toDateString()}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          eventId: ticket.eventId,
          eventName: event?.name ?? 'Evento desconocido',
          date: formatDate(ticket.issuedAt),
          tickets: [],
          total: 0,
          currency: ticket.currency
        };
      }
      acc[key].tickets.push(ticket);
      acc[key].total += ticket.price;
      return acc;
    }, {} as Record<string, { id: string; eventId: string; eventName: string; date: string; tickets: TicketDTO[]; total: number; currency: string }>);
    return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [ticketsWithEvents]);

  return (
    <Container sx={{ py: 8 }}>
      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Avatar sx={{ width: 96, height: 96 }}>
                  {user?.email?.charAt(0).toUpperCase() ?? 'U'}
                </Avatar>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700}>
                    {user?.email?.split('@')[0] ?? 'Usuario'}
                  </Typography>
                  <Typography color="text.secondary">{user?.email ?? 'No disponible'}</Typography>
                  <Chip label={user?.role ?? 'Usuario'} color="primary" size="small" sx={{ mt: 1 }} />
                </Box>
                <Button variant="outlined" fullWidth>
                  Editar perfil
                </Button>
              </Stack>
              <DividerSection title="Estadísticas">
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Tickets comprados: <strong>{tickets.length}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Eventos únicos: <strong>{new Set(tickets.map((t) => t.eventId)).size}</strong>
                  </Typography>
                </Stack>
              </DividerSection>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
              <Tab label="Mis tickets" />
              <Tab label="Favoritos" />
              <Tab label="Historial" />
              <Tab label="Pago" />
            </Tabs>
            <CardContent>
              {tab === 0 && <TicketsSection ticketsWithEvents={ticketsWithEvents} loading={ticketsLoading} />}
              {tab === 1 && <EmptyState text="Todavía no agregaste eventos a favoritos." />}
              {tab === 2 && <PurchasesSection purchases={purchases} />}
              {tab === 3 && <EmptyState text="No tenés métodos de pago guardados." />}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}

function TicketsSection({ ticketsWithEvents, loading }: { ticketsWithEvents: Array<{ ticket: TicketDTO; event: { id: string; name: string; location: string } | undefined }>; loading: boolean }) {
  if (loading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (ticketsWithEvents.length === 0) {
    return <EmptyState text="No tenés tickets comprados todavía." />;
  }

  return (
    <Stack spacing={2}>
      {ticketsWithEvents.map(({ ticket, event }) => (
        <Card key={ticket.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {event?.name ?? 'Evento no encontrado'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(ticket.issuedAt)} · {event?.location ?? 'Ubicación no disponible'}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip label={formatCurrency(ticket.price, ticket.currency)} size="small" variant="outlined" />
                  <Chip
                    label={ticket.status}
                    size="small"
                    color={ticket.status === 'confirmed' ? 'success' : ticket.status === 'pending' ? 'warning' : 'default'}
                  />
                </Stack>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                {event && (
                  <Button variant="outlined" component={Link} href={`/events/${event.id}`} size="small">
                    Ver evento
                  </Button>
                )}
                <Button variant="contained" size="small">
                  Ver QR
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function PurchasesSection({ purchases }: { purchases: Array<{ id: string; eventId: string; eventName: string; date: string; tickets: TicketDTO[]; total: number; currency: string }> }) {
  if (purchases.length === 0) {
    return <EmptyState text="No tenés compras registradas." />;
  }

  return (
    <Stack spacing={2}>
      {purchases.map((purchase) => (
        <Card key={purchase.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Compra del {purchase.date}
                </Typography>
                <Typography variant="h6" fontWeight={600}>{purchase.eventName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {purchase.tickets.length} ticket{purchase.tickets.length > 1 ? 's' : ''}
                </Typography>
              </Box>
              <Typography fontWeight={700}>{formatCurrency(purchase.total, purchase.currency)}</Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function DividerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>{title}</Typography>
      {children}
    </Box>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Box textAlign="center" py={6}>
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
