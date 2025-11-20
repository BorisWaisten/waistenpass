'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DownloadIcon from '@mui/icons-material/Download';

const featuredEvents = [
  {
    title: 'Aurora Live en Buenos Aires',
    date: '12 Dic - 21:00 hs',
    location: 'Movistar Arena',
    price: 'Desde $45.000',
    image:
      'https://images.unsplash.com/photo-1470229522915-1fa732472f8e?auto=format&w=1200&q=80'
  },
  {
    title: 'Festival Tech Future',
    date: '03 Ene - 09:00 hs',
    location: 'La Rural',
    price: 'Desde $25.000',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&w=1200&q=80'
  },
  {
    title: 'NBA Global Games',
    date: '20 Ene - 19:30 hs',
    location: 'Luna Park',
    price: 'Desde $80.000',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&w=1200&q=80'
  }
];

const categories = [
  { label: 'Música', icon: '🎵' },
  { label: 'Deportes', icon: '🏆' },
  { label: 'Teatro', icon: '🎭' },
  { label: 'Tecnología', icon: '💻' },
  { label: 'Conferencias', icon: '🎤' },
  { label: 'Familiar', icon: '👨‍👩‍👧' }
];

const steps = [
  {
    title: 'Buscá un evento',
    description: 'Explorá por ciudad, categoría o fecha y encontrá lo que te gusta.'
  },
  {
    title: 'Elegí tus entradas',
    description: 'Seleccioná tu sector favorito, compará precios y asegurá tu lugar.'
  },
  {
    title: 'Recibí el ticket digital',
    description: 'Te llegará al instante por mail y lo vas a tener disponible en tu perfil.'
  }
];

const testimonials = [
  {
    name: 'Lourdes P.',
    comment:
      'La experiencia fue súper ágil. En tres clics ya tenía mis tickets para el show.',
    avatar: 'https://i.pravatar.cc/150?img=47'
  },
  {
    name: 'Gonzalo M.',
    comment: 'Me encantó el diseño y los recordatorios previos al evento. Excelente.',
    avatar: 'https://i.pravatar.cc/150?img=56'
  }
];

export default function HomePage() {
  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <HeroSection />
      <FeaturedEvents />
      <CategorySection />
      <NearbyEvents />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </Box>
  );
}

function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        color: '#fff',
        pb: { xs: 8, md: 12 },
        backgroundImage:
          'linear-gradient(135deg, rgba(90,103,216,0.95), rgba(127,156,245,0.95)), url(https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      id="home"
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 } }}>
        <Stack spacing={3} maxWidth={680}>
          <Chip
            label="🎟️ La plataforma favorita para descubrir eventos"
            sx={{ width: 'fit-content', bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
          />
          <Typography variant="h2" fontWeight={700} lineHeight={1.2}>
            Descubrí y comprá tickets para los mejores eventos.
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.9)" fontWeight={400}>
            Conciertos, deportes, teatro y mucho más. Todo en un solo lugar con pagos seguros y tickets digitales.
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Buscá por evento, artista o ciudad"
              fullWidth
              sx={{ bgcolor: '#fff', borderRadius: 999 }}
              InputProps={{
                startAdornment: (
                  <SearchIcon color="primary" sx={{ mr: 1 }} />
                )
              }}
            />
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}>Explorar eventos</Button>
          </Stack>
          <Stack direction="row" spacing={4} pt={2}>
            <Stat label="Eventos activos" value="+320" />
            <Stat label="Usuarios felices" value="+120K" />
            <Stat label="Ciudades" value="24" />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>{value}</Typography>
      <Typography variant="body2" color="rgba(255,255,255,0.8)">{label}</Typography>
    </Box>
  );
}

function FeaturedEvents() {
  return (
    <Container id="events" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Eventos destacados
          </Typography>
          <Typography variant="body1">
            Curamos experiencias únicas para que siempre tengas algo nuevo que vivir.
          </Typography>
        </Box>
        <Button variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ display: { xs: 'none', md: 'flex' } }}>
          Ver todos
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {featuredEvents.map((event) => (
          <Grid size={{ xs: 12, md: 4 }} key={event.title}>
            <Card sx={{ height: '100%' }}>
              <Box
                sx={{
                  height: 220,
                  borderRadius: '24px 24px 0 0',
                  backgroundImage: `url(${event.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent>
                <Chip label="Imperdible" color="secondary" size="small" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {event.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <CalendarMonthIcon fontSize="small" />
                  <Typography variant="body2">{event.date}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" mt={0.5}>
                  <PlaceIcon fontSize="small" />
                  <Typography variant="body2">{event.location}</Typography>
                </Stack>
                <Typography variant="subtitle1" fontWeight={600} mt={2}>
                  {event.price}
                </Typography>
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                  Ver evento
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function CategorySection() {
  return (
    <Container id="categories" sx={{ pb: { xs: 8, md: 12 } }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
        Categorías para todos los gustos
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category.label}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <Typography fontSize={36} mb={1}>{category.icon}</Typography>
              <Typography fontWeight={600}>{category.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function NearbyEvents() {
  const events = featuredEvents.slice(0, 2);
  return (
    <Container sx={{ pb: { xs: 8, md: 12 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Eventos cerca tuyo
          </Typography>
          <Typography>Activá la geolocalización y te mantenemos al tanto.</Typography>
        </Box>
        <Button variant="text" endIcon={<ArrowForwardIcon />}>Ver mapa</Button>
      </Stack>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid size={{ xs: 12, md: 6 }} key={event.title}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 3,
                      backgroundImage: `url(${event.image})`,
                      backgroundSize: 'cover'
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Cerca de vos
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>{event.title}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                      <CalendarMonthIcon fontSize="small" />
                      <Typography variant="body2">{event.date}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                      <PlaceIcon fontSize="small" />
                      <Typography variant="body2">{event.location}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function HowItWorks() {
  return (
    <Box id="how-it-works" sx={{ backgroundColor: '#fff', py: { xs: 8, md: 12 } }}>
      <Container>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
          Cómo funciona
        </Typography>
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={step.title}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Chip label={`Paso ${index + 1}`} color="primary" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>{step.title}</Typography>
                  <Typography variant="body2" mt={1}>{step.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function Testimonials() {
  return (
    <Container sx={{ py: { xs: 8, md: 12 } }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <EventAvailableIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Tus tickets, siempre a mano</Typography>
            </Stack>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ConfirmationNumberIcon color="secondary" />
                <Typography>Accedé a tus compras y QR desde la app.</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <DownloadIcon color="secondary" />
                <Typography>Descargá versiones offline o compartilas con amigos.</Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Opiniones reales
            </Typography>
            <Stack spacing={3}>
              {testimonials.map((item) => (
                <Stack key={item.name} direction="row" spacing={2} alignItems="center">
                  <Avatar src={item.avatar} />
                  <Box>
                    <Typography fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2">{item.comment}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function Footer() {
  return (
    <Box id="support" sx={{ backgroundColor: '#1A202C', color: '#fff', py: 6 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight={700}>WaistenPass</Typography>
            <Typography variant="body2" mt={2}>
              Tu nueva manera de descubrir, comprar y disfrutar eventos sin complicaciones.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight={600}>Links rápidos</Typography>
            <Stack spacing={1} mt={2}>
              <Typography variant="body2">Eventos</Typography>
              <Typography variant="body2">Categorías</Typography>
              <Typography variant="body2">Soporte</Typography>
              <Typography variant="body2">Soy organizador</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight={600}>Recibí novedades</Typography>
            <Typography variant="body2" mt={2}>
              Inscribite para enterarte antes que nadie de nuevos eventos.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
              <TextField placeholder="Tu email" variant="filled" color="secondary" fullWidth InputProps={{ disableUnderline: true }} />
              <Button variant="contained" color="secondary">Enviar</Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.12)' }} />
        <Typography variant="caption" color="rgba(255,255,255,0.7)">
          © {new Date().getFullYear()} WaistenPass. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
