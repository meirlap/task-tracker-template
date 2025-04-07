import React, { useEffect, useState } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Button, Box
} from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';
import {
  getDoctorPatientsByEmail,
  addPatientToDoctorByEmail,
  updatePatientById,
  deletePatientById
} from '../../utils/api';

const DoctorView = ({ doctorEmail, doctorName }) => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', israeli_id: '', email: '' });
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const pat = await getDoctorPatientsByEmail(doctorEmail);
        setPatients(pat);
      } catch (err) {
        console.error('❌ Failed loading doctor patients', err);
      }
    };

    if (doctorEmail) fetchPatients();
  }, [doctorEmail]);

  const handleInputChange = (e) => {
    setNewPatient(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddPatient = async () => {
    try {
      const added = await addPatientToDoctorByEmail(doctorEmail, newPatient);
      setPatients(prev => [...prev, added]);
      setNewPatient({ name: '', israeli_id: '', email: '' });
    } catch (err) {
      console.error('❌ Failed to add patient:', err);
    }
  };

  const handleEditClick = (id, patient) => {
    setEditRowId(id);
    setEditedData({ ...patient });
  };

  const handleEditedChange = (e) => {
    setEditedData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const updated = await updatePatientById(id, editedData);
      setPatients(prev => prev.map(p => p.id === id ? updated : p));
      setEditRowId(null);
    } catch (err) {
      console.error('❌ Failed to save patient update:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המטופל?')) return;
    try {
      await deletePatientById(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('❌ Failed to delete patient:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        שלום דוקטור {doctorName}
      </Typography>

      <Typography variant="h5" gutterBottom>ניהול מטופלים</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="שם מלא"
          name="name"
          value={newPatient.name}
          onChange={handleInputChange}
        />
        <TextField
          label="תז"
          name="israeli_id"
          value={newPatient.israeli_id}
          onChange={handleInputChange}
        />
        <TextField
          label="אימייל"
          name="email"
          value={newPatient.email}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={handleAddPatient}>הוסף מטופל</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell>ת"ז</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>הורה</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {editRowId === p.id
                    ? <TextField name="name" value={editedData.name} onChange={handleEditedChange} />
                    : p.name}
                </TableCell>
                <TableCell>
                  {editRowId === p.id
                    ? <TextField name="israeli_id" value={editedData.israeli_id} onChange={handleEditedChange} />
                    : p.israeli_id}
                </TableCell>
                <TableCell>
                  {editRowId === p.id
                    ? <TextField name="email" value={editedData.email} onChange={handleEditedChange} />
                    : p.email}
                </TableCell>
                <TableCell>
                  {p.parent_name
                    ? `${p.parent_name} (${p.parent_email})`
                    : '—'}
                </TableCell>
                <TableCell>
                  {editRowId === p.id ? (
                    <IconButton onClick={() => handleSaveEdit(p.id)}><Save /></IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditClick(p.id, p)}><Edit /></IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(p.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorView;
