'use client';

import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Eventos', href: '#events' },
  { label: 'Categorías', href: '#categories' },
  { label: 'Cómo funciona', href: '#how-it-works' },
  { label: 'Soporte', href: '#support' }
];

const drawerLinks = [...navLinks, { label: 'Soy Organizador', href: '#organizer' }];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box sx={{ width: 280, p: 3 }} role="presentation" onClick={handleDrawerToggle}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        EasyTicket
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {drawerLinks.map((item) => (
          <ListItemButton key={item.label} component={Link} href={item.href}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Stack gap={1.5} mt={2}>
        <Button component={Link} href="/auth/login" variant="outlined" fullWidth>
          Iniciar Sesión
        </Button>
        <Button component={Link} href="/auth/register" variant="contained" color="primary" fullWidth>
          Registrarse
        </Button>
      </Stack>
      <Button variant="text" sx={{ mt: 2 }} fullWidth>
        Soy Organizador
      </Button>
    </Box>
  );

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(26,32,44,0.08)' }}>
      <Toolbar sx={{ py: 1.5, px: { xs: 2, md: 6 }, gap: 2 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: { xs: 1, md: 0 } }}>
          <Typography component={Link} href="/" variant="h6" fontWeight={700} color="primary.main" sx={{ textDecoration: 'none' }}>
            EasyTicket
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mx: 4, flexGrow: 1 }}>
          {navLinks.map((item) => (
            <Button key={item.label} component={Link} href={item.href} color="inherit">
              {item.label}
            </Button>
          ))}
          <TextField
            placeholder="Buscar eventos, ciudades o fechas"
            size="small"
            sx={{ minWidth: 280, backgroundColor: 'background.paper', borderRadius: 999 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 999 }
            }}
          />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button component={Link} href="/auth/login" color="inherit">
            Iniciar Sesión
          </Button>
          <Button component={Link} href="/auth/register" variant="contained">
            Registrarse
          </Button>
          <Button color="secondary">Soy Organizador</Button>
        </Box>

        {/* Mobile Icons */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          <IconButton color="primary">
            <SearchIcon />
          </IconButton>
          <IconButton color="primary">
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}
