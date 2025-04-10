import React, { useEffect, useState } from 'react';
import {
  getAllAdmins,
  getAllDoctors,
  addAdmin,
  addDoctor,
  updateAdmin,
  deleteAdmin,
  updateDoctor,
  deleteDoctor,
} from '../../utils/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const AdminView = () => {
  const [admins, setAdmins] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [adminData, setAdminData] = useState({ full_name: '', email: '' });
  const [doctorData, setDoctorData] = useState({ full_name: '', email: '' });

  useEffect(() => {
    getAllAdmins().then(setAdmins);
    getAllDoctors().then(setDoctors);
  }, []);

  const handleAddAdmin = () => {
    addAdmin(adminData).then((newAdmin) => {
      setAdmins([...admins, newAdmin]);
      setAdminData({ full_name: '', email: '' });
    });
  };

  const handleAddDoctor = () => {
    addDoctor(doctorData).then((newDoctor) => {
      setDoctors([...doctors, newDoctor]);
      setDoctorData({ full_name: '', email: '' });
    });
  };

  const handleEditAdmin = (admin) => {
    const full_name = prompt('Enter new name', admin.full_name);
    if (full_name) {
      updateAdmin(admin.id, { full_name }).then((updatedAdmin) => {
        setAdmins(admins.map(a => a.id === admin.id ? updatedAdmin : a));
      });
    }
  };

  const handleDeleteAdmin = (id) => {
    if (confirm('Are you sure to delete admin?')) {
      deleteAdmin(id).then(() => {
        setAdmins(admins.filter(a => a.id !== id));
      });
    }
  };

  const handleEditDoctor = (doctor) => {
    const full_name = prompt('Enter new name', doctor.full_name);
    if (full_name) {
      updateDoctor(doctor.id, { full_name }).then((updatedDoctor) => {
        setDoctors(doctors.map(d => d.id === doctor.id ? updatedDoctor : d));
      });
    }
  };

  const handleDeleteDoctor = (id) => {
    if (confirm('Are you sure to delete doctor?')) {
      deleteDoctor(id).then(() => {
        setDoctors(doctors.filter(d => d.id !== id));
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Add Admin</Typography>
        <TextField label="Name" value={adminData.full_name}
          onChange={e => setAdminData({ ...adminData, full_name: e.target.value })}
          sx={{ mr: 2, mb: 1 }} />
        <TextField label="Email" value={adminData.email}
          onChange={e => setAdminData({ ...adminData, email: e.target.value })}
          sx={{ mr: 2, mb: 1 }} />
        <Button variant="contained" onClick={handleAddAdmin}>Add Admin</Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Add Doctor</Typography>
        <TextField label="Name" value={doctorData.full_name}
          onChange={e => setDoctorData({ ...doctorData, full_name: e.target.value })}
          sx={{ mr: 2, mb: 1 }} />
        <TextField label="Email" value={doctorData.email}
          onChange={e => setDoctorData({ ...doctorData, email: e.target.value })}
          sx={{ mr: 2, mb: 1 }} />
        <Button variant="contained" onClick={handleAddDoctor}>Add Doctor</Button>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Current Admins</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.full_name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditAdmin(admin)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteAdmin(admin.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ p: 2 }}>Current Doctors</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.full_name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditDoctor(doctor)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteDoctor(doctor.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminView;
