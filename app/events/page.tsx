'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useEvents } from '@/lib/hooks/useEvents';
import { EventDTO } from '@/lib/types';

const fallbackCategories = ['Música', 'Deportes', 'Teatro', 'Tecnología', 'Conferencias', 'Familiar'];
const fallbackCities = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'];
const orderOptions = [
  { label: 'Fecha', value: 'date' },
  { label: 'Capacidad', value: 'capacity' }
];

const categoryCovers: Record<string, string> = {
  Música: 'https://images.unsplash.com/photo-1470229522915-1fa732472f8e?auto=format&w=1600&q=80',
  Deportes: 'https://images.unsplash.com/photo-1509223197845-458b2edbddd1?auto=format&w=1600&q=80',
  Teatro: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&w=1600&q=80',
  Tecnología: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&w=1600&q=80',
  Conferencias: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&w=1600&q=80',
  Familiar: 'https://images.unsplash.com/photo-1500530857757-b5861531f063?auto=format&w=1600&q=80'
};

function getCoverImage(event: EventDTO) {
  const primary = event.categories?.[0];
  return categoryCovers[primary as keyof typeof categoryCovers] ?? categoryCovers.Música;
}

function formatDateRange(event: EventDTO) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const formatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' });
  const startText = formatter.format(start);
  const endText = formatter.format(end);
  return startText === endText ? startText : `${startText} - ${endText}`;
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

export default function EventsPage() {
  const { events, loading, error, refresh } = useEvents();
  const [filters, setFilters] = useState({
    query: '',
    category: 'Todos',
    city: 'Todas',
    order: 'date'
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const derivedCategories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((event) => event.categories?.forEach((cat) => set.add(cat)));
    const base = Array.from(set);
    return ['Todos', ...(base.length ? base : fallbackCategories)];
  }, [events]);

  const derivedCities = useMemo(() => {
    const set = new Set<string>();
    events.forEach((event) => {
      const [city] = event.location.split(',');
      if (city) set.add(city.trim());
    });
    const base = Array.from(set);
    return ['Todas', ...(base.length ? base : fallbackCities)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .map((event) => ({ ...event, coverImage: getCoverImage(event) }))
      .filter((event) => event.name.toLowerCase().includes(filters.query.toLowerCase()))
      .filter((event) =>
        filters.category === 'Todos' ? true : event.categories?.some((cat) => cat === filters.category)
      )
      .filter((event) => (filters.city === 'Todas' ? true : event.location.toLowerCase().includes(filters.city.toLowerCase())))
      .sort((a, b) => {
        if (filters.order === 'capacity') {
          return b.capacity - a.capacity;
        }
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [events, filters]);

  const FiltersContent = (
    <Stack spacing={3} sx={{ width: 280, p: 3 }}>
      <Typography variant="h6">Filtrar</Typography>
      <TextField
        label="Buscar"
        variant="outlined"
        size="small"
        value={filters.query}
        onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
      />
      <FormControl size="small">
        <InputLabel>Categoría</InputLabel>
        <Select
          label="Categoría"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        >
          {derivedCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel>Ciudad</InputLabel>
        <Select
          label="Ciudad"
          value={filters.city}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
        >
          {derivedCities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel>Ordenar por</InputLabel>
        <Select
          label="Ordenar por"
          value={filters.order}
          onChange={(e) => setFilters((prev) => ({ ...prev, order: e.target.value }))}
        >
          {orderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={refresh} variant="text">
        Actualizar
      </Button>
    </Stack>
  );

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h3" fontWeight={700}>
            Explorar eventos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Encontrá la experiencia perfecta usando filtros por ciudad, categoría o fecha.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Buscar eventos"
            size="small"
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            sx={{ display: { xs: 'none', md: 'block' } }}
          />
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setDrawerOpen(true)}>
            Filtros
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Card>
            <CardContent>{FiltersContent}</CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Card>
                      <Skeleton variant="rectangular" height={180} sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
                      <CardContent>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                        <Skeleton width="80%" height={16} sx={{ mt: 2 }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : filteredEvents.map((event) => (
                  <Grid key={event.id} size={{ xs: 12, sm: 6 }}>
                    <Card sx={{ height: '100%' }}>
                      <Box
                        sx={{
                          height: 200,
                          borderRadius: '24px 24px 0 0',
                          backgroundImage: `url(${event.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <CardContent>
                        <Chip label={event.categories[0] ?? 'Evento'} size="small" sx={{ mb: 1 }} />
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {event.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                          <CalendarMonthIcon fontSize="small" />
                          <Typography variant="body2">{formatDateRange(event)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" mt={0.5}>
                          <PlaceIcon fontSize="small" />
                          <Typography variant="body2">{event.location}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {event.price !== undefined ? formatCurrency(event.price, event.currency) : 'Precio no disponible'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.sold ?? 0}/{event.capacity ?? 0} vendidos
                          </Typography>
                        </Stack>
                        <Button
                          component={Link}
                          href={`/events/${event.id}`}
                          variant="outlined"
                          size="small"
                          sx={{ mt: 2 }}
                        >
                          Ver evento
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            {!loading && filteredEvents.length === 0 && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 6 }}>
                <Typography variant="h6">No encontramos eventos que coincidan con tu búsqueda.</Typography>
                <Typography variant="body2" color="text.secondary">
                  Probá ajustando los filtros para ver más opciones.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ display: { xs: 'block', md: 'none' } }}>
        {FiltersContent}
      </Drawer>
    </Container>
  );
}
