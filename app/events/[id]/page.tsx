'use client';

import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link as MuiLink,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChairIcon from '@mui/icons-material/Chair';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent, useEvents } from '@/lib/hooks/useEvents';
import { usePurchaseTicket } from '@/lib/hooks/useTickets';
import { getAccessToken } from '@/lib/api';
import type { EventDTO } from '@/lib/types';

const categoryCovers: Record<string, string> = {
  Música: 'https://images.unsplash.com/photo-1470229522915-1fa732472f8e?auto=format&w=1600&q=80',
  Deportes: 'https://images.unsplash.com/photo-1509223197845-458b2edbddd1?auto=format&w=1600&q=80',
  Teatro: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&w=1600&q=80',
  Tecnología: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&w=1600&q=80',
  Conferencias: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&w=1600&q=80',
  Familiar: 'https://images.unsplash.com/photo-1500530857757-b5861531f063?auto=format&w=1600&q=80'
};

function getCoverImage(categories: string[]) {
  const primary = categories?.[0];
  return categoryCovers[primary as keyof typeof categoryCovers] ?? categoryCovers.Música;
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).format(new Date(date));
}

const ticketMultipliers = [
  { id: 'general', label: 'General', factor: 1, description: 'Acceso general al evento', availability: 'Alta' },
  { id: 'preferential', label: 'Preferencial', factor: 1.35, description: 'Butacas numeradas con mejor visibilidad', availability: 'Media' },
  { id: 'vip', label: 'VIP Experience', factor: 1.8, description: 'Incluye meet & greet y merchandising', availability: 'Limitado' }
];

function buildTicketOptions(event: EventDTO) {
  const basePrice = event.price ?? 0;
  const currency = event.currency ?? 'ARS';
  return ticketMultipliers.map((tier) => ({
    ...tier,
    price: Math.round(basePrice * tier.factor),
    currency
  }));
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

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;
  const { event, loading, error } = useEvent(eventId);
  const { events: allEvents } = useEvents();
  const { createPaymentPreference, loading: purchaseLoading } = usePurchaseTicket();
  const [tab, setTab] = useState(0);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [purchaseState, setPurchaseState] = useState<'idle' | 'success' | 'error'>('idle');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const router = useRouter();

  const related = useMemo(() => {
    if (!event) return [];
    return allEvents
      .filter((item) => item.id !== event.id && item.categories.some((cat) => event.categories.includes(cat)))
      .slice(0, 3);
  }, [allEvents, event]);

  const ticketOptions = useMemo(() => {
    if (!event) return [];
    return buildTicketOptions(event);
  }, [event]);

  // Initialize selected tier when ticket options are available
  if (ticketOptions.length > 0 && !selectedTier) {
    setSelectedTier(ticketOptions[0].id);
  }

  if (loading) {
    return (
      <Container sx={{ py: 10 }}>
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4, mb: 4 }} />
        <Grid container spacing={4}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    notFound();
  }

  const heroImage = getCoverImage(event!.categories);
  const activeTier = ticketOptions.find((tier) => tier.id === selectedTier);

  const handleScrollToPurchase = () => {
    const element = document?.getElementById('ticket-purchase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTab(0);
    }
  };

  const handlePurchase = async () => {
    if (!event || !activeTier) return;
    const token = getAccessToken();
    if (!token) {
      router.push(`/auth/login?next=/events/${event.id}`);
      return;
    }
    setPurchaseState('idle');
    setPurchaseMessage('');
    try {
      const result = await createPaymentPreference(event.id, quantity);
      // Redirigir al usuario a Mercado Pago para completar el pago
      if (result.initPoint) {
        window.location.href = result.initPoint;
      } else {
        throw new Error('No se pudo generar el link de pago');
      }
    } catch (err) {
      setPurchaseState('error');
      setPurchaseMessage((err as Error).message || 'Error al procesar la compra. Por favor, intentá nuevamente.');
    }
  };

  return (
    <Box>
      <Box
        sx={{
          height: 420,
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.4)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff'
        }}
      >
        <Container sx={{ pt: 8 }}>
          <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.8)' }}>
            <MuiLink href="/" color="inherit">
              Inicio
            </MuiLink>
            <MuiLink href="/events" color="inherit">
              Eventos
            </MuiLink>
            <Typography color="inherit">{event!.name}</Typography>
          </Breadcrumbs>
          <Typography variant="h2" fontWeight={700} mt={3}>
            {event!.name}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mt={2} color="rgba(255,255,255,0.9)">
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthIcon />
              <Typography>{formatFullDate(event!.startDate)}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon />
              <Typography>
                {new Date(event!.startDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PlaceIcon />
              <Typography>{event!.location}</Typography>
            </Stack>
          </Stack>
          <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={handleScrollToPurchase}>
            Comprar entradas
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Sobre el evento
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {event!.description}
                </Typography>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Información del lugar
                </Typography>
                <Stack spacing={1} color="text.secondary">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlaceIcon color="primary" />
                    <Typography>{event!.location}</Typography>
                  </Stack>
                  <Typography variant="body2">
                    Capacidad total: {event!.capacity.toLocaleString()} personas · Entradas vendidas: {event!.sold.toLocaleString()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {related.length > 0 && (
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Eventos relacionados
                </Typography>
                <Stack spacing={2}>
                    {related.map((item) => (
                      <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography fontWeight={600}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatFullDate(item.startDate)} · {item.location}
                          </Typography>
                        </Box>
                        <Button size="small" component={MuiLink} href={`/events/${item.id}`}>
                          Ver evento
                        </Button>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} id="ticket-purchase">
            <Card sx={{ position: 'sticky', top: 24 }}>
              <Tabs value={tab} onChange={(_: unknown, value: number) => setTab(value)}>
                <Tab label="Entradas" />
                <Tab label="Detalles" />
              </Tabs>
              <CardContent>
                {tab === 0 && (
                <Stack spacing={2}>
                    {ticketOptions.map((ticket) => {
                      const isActive = ticket.id === selectedTier;
                      return (
                        <Card
                          key={ticket.id}
                          variant={isActive ? 'outlined' : undefined}
                          sx={{ borderColor: isActive ? 'primary.main' : undefined, cursor: 'pointer' }}
                          onClick={() => setSelectedTier(ticket.id)}
                        >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                                <Typography fontWeight={600}>{ticket.label}</Typography>
                                <Typography variant="body2" color="text.secondary">{ticket.description}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                                  <ChairIcon fontSize="small" color="primary" />
                                  <Typography variant="caption">Disponibilidad: {ticket.availability}</Typography>
                                </Stack>
                          </Box>
                              <Typography fontWeight={700}>{formatCurrency(ticket.price, ticket.currency)}</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                      );
                    })}
                    {activeTier && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Cantidad:
                        </Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value, 10);
                            if (val > 0 && val <= (event!.capacity - event!.sold)) {
                              setQuantity(val);
                            }
                          }}
                          inputProps={{ min: 1, max: event!.capacity - event!.sold }}
                          sx={{ width: 80 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                          Total: {formatCurrency(activeTier.price * quantity, activeTier.currency)}
                        </Typography>
                      </Stack>
                    )}
                    {purchaseState === 'success' && purchaseMessage && (
                      <Alert severity="success">{purchaseMessage}</Alert>
                    )}
                    {purchaseState === 'error' && purchaseMessage && (
                      <Alert severity="error">{purchaseMessage}</Alert>
                    )}
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!activeTier || purchaseLoading || quantity <= 0 || quantity > (event!.capacity - event!.sold)}
                      onClick={handlePurchase}
                      sx={{ mt: 2 }}
                    >
                      {purchaseLoading ? 'Procesando…' : 'Confirmar compra'}
                    </Button>
                    {activeTier && (
                      <Typography variant="caption" color="text.secondary" textAlign="center">
                        Disponibles: {event!.capacity - event!.sold} entradas
                      </Typography>
                    )}
                  </Stack>
                )}
                {tab === 1 && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Organizado por <strong>{event!.organizerId}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recordá llevar tu documento para validar tus tickets digitales. Si tenés dudas, contactá a soporte desde tu perfil.
                    </Typography>
                </Stack>
                )}
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{event!.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Organiza
                    </Typography>
                    <Typography fontWeight={600}>{event!.organizerId}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
