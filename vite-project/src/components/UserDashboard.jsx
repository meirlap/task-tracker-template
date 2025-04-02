import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getChildrenAndTasks } from '../utils/api'; // ← שינוי חשוב

const UserDashboard = ({ userEmail }) => {
  const [childrenWithTasks, setChildrenWithTasks] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getChildrenAndTasks(userEmail);
        setChildrenWithTasks(data);
      } catch (err) {
        console.error('❌ Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userEmail]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {!selectedChild ? (
        <>
          <Typography variant="h5" gutterBottom>{t('dashboard.select_child')}</Typography>
          <Grid container spacing={2}>
            {childrenWithTasks.map(entry => (
              <Grid item xs={12} sm={6} md={4} key={entry.patient.id}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => setSelectedChild(entry)}>
                  <CardContent>
                    <Typography variant="h6">{entry.patient.name}</Typography>
                    <Typography variant="body2">{t('dashboard.id')}: {entry.patient.israeli_id}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Button variant="contained" onClick={() => setSelectedChild(null)} sx={{ mb: 2 }}>
            ← {t('dashboard.back')}
          </Button>
          <Typography variant="h5" gutterBottom>
            {t('dashboard.tasks_title', { name: selectedChild.patient.name })}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('dashboard.date')}</TableCell>
                  <TableCell>{t('dashboard.task')}</TableCell>
                  <TableCell>{t('dashboard.completed')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedChild.tasks.map((task, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{task.date}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.completed ? '✅' : ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default UserDashboard;
