import React, { useState, useEffect } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import UserDashboard from './components/UserDashboard';
import { AppBar, Toolbar, Typography, Button, Container, Avatar, Box, Paper, CircularProgress } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { getUserRole } from './utils/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.email && !parsed.role) {
        getUserRole(parsed.email)
          .then((data) => {
            const updated = { ...parsed, role: data.role };
            setUser(updated);
            setRole(data.role);
            localStorage.setItem('user', JSON.stringify(updated));
          })
          .catch((err) => {
            console.error("❌ Failed to get role:", err);
          })
          .finally(() => setLoading(false));
      } else {
        setRole(parsed.role);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <MedicalServicesIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          <LanguageSelector />
          {user && <Button color="inherit" onClick={handleLogout}>{t('app.logout')}</Button>}
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ mt: 4, px: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : !user ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5">🔐 {t('app.login_prompt')}</Typography>
            <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />
          </Paper>
        ) : (
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={user.picture} sx={{ mr: 2 }} />
            </Box>
            <UserDashboard userEmail={user.email} />
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default App;
