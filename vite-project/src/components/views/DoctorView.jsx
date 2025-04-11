import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent,
  Container, TextField
} from '@mui/material';

import {
  getPatientsTasksByEmail,
  addPatientToDoctorByEmail,
  updatePatientById,
  deletePatientById,
  getTasksForPatient
} from '../../utils/api';

import PatientsTable from '../PatientsTable';
import AddPatientForm from '../AddPatientForm';
import { useTranslation } from 'react-i18next';

const DoctorView = ({ doctorEmail, doctorName }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTasks, setPatientTasks] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { i18n, t } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    if (doctorEmail) {
      getPatientsTasksByEmail(doctorEmail).then(data => {
        const enriched = data.map(item => ({
          ...item.patient,
          tasks: item.tasks
        }));
        setPatients(enriched);
      });
    }
  }, [doctorEmail]);

  useEffect(() => {
    if (selectedPatient) {
      getTasksForPatient(selectedPatient.id, 30).then(setPatientTasks);
    }
  }, [selectedPatient]);

  const handleAddPatient = async (newPatient) => {
    try {
      const added = await addPatientToDoctorByEmail(doctorEmail, newPatient);
      setPatients(prev => [...prev, { ...added, tasks: [] }]);
      setOpenModal(false);
    } catch (err) {
      console.error("❌ Failed to add patient", err);
    }
  };

  const handleSaveEdit = async (id) => {
    const updated = await updatePatientById(id, editedData);
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    setEditRowId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('האם אתה בטוח?')) return;
    await deletePatientById(id);
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.hello_doctor')} {doctorName}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            label={t("filters.filter_name")}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label={t("filters.filter_id")}
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label={t("filters.filter_email")}
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" onClick={() => setOpenModal(true)} fullWidth>
            {t("add_patient")}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PatientsTable
            patients={patients}
            filterName={filterName}
            filterId={filterId}
            filterEmail={filterEmail}
            editRowId={editRowId}
            setEditRowId={setEditRowId}
            editedData={editedData}
            setEditedData={setEditedData}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
            onSelect={setSelectedPatient}
            selectedPatient={selectedPatient}
            setPatients={setPatients}
          />
        </Grid>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("add_patient")}</DialogTitle>
        <DialogContent>
          <AddPatientForm onAdd={handleAddPatient} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DoctorView;
