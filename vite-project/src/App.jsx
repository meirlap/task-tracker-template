import React, { useState, useEffect } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import UserDashboard from './components/UserDashboard';
import { AppBar, Toolbar, Typography, Button, Container, Avatar, Box, Paper } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';

const App = () => {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
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

      <Container sx={{ mt: 4 }}>
        {!user ? (
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
