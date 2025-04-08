import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddPatientForm = ({ onAdd, onEdit, patient = null, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    israeli_id: '',
    email: ''
  });

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || '',
        israeli_id: patient.israeli_id || '',
        email: patient.email || ''
      });
    } else {
      setForm({ name: '', israeli_id: '', email: '' });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { name, israeli_id, email } = form;
    if (!name || !israeli_id || !email) {
      alert("יש למלא את כל השדות");
      return;
    }

    if (patient && onEdit) {
      onEdit({ ...form, id: patient.id });
    } else if (onAdd) {
      onAdd(form);
    }

    if (!patient) {
      setForm({ name: '', israeli_id: '', email: '' });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        label="שם המטופל"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="תעודת זהות"
        name="israeli_id"
        value={form.israeli_id}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="אימייל"
        name="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
      />

      <Button variant="contained" onClick={handleSubmit}>
        {patient ? 'שמור שינויים' : 'הוסף מטופל'}
      </Button>

      {patient && onCancel && (
        <Button variant="outlined" onClick={onCancel}>
          בטל
        </Button>
      )}
    </Box>
  );
};

export default AddPatientForm;
