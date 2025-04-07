import React, { useEffect, useState } from 'react';
import ParentView from './views/ParentView';
import PatientView from './views/PatientView';
import DoctorView from './views/DoctorView';
import { getUserRole } from '../utils/api';
import { CircularProgress, Typography, Box } from '@mui/material';

const UserDashboard = ({ userEmail }) => {
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await getUserRole(userEmail);
        setRole(data.role);
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user role:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchRole();
    }
  }, [userEmail]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>טוען נתוני משתמש...</Typography>
      </Box>
    );
  }

  if (!role) {
    return (
      <Typography sx={{ mt: 3, color: 'error.main' }}>
        לא ניתן לזהות את תפקיד המשתמש.
      </Typography>
    );
  }

  switch (role) {
    case 'doctor':
      return <DoctorView doctorEmail={userEmail} doctorName={userData.full_name} />;
    case 'parent':
      return <ParentView parentEmail={userEmail} />;
    case 'patient':
      return <PatientView patient={userData.patient} />;
    default:
      return (
        <Typography sx={{ mt: 3, color: 'error.main' }}>
          תפקיד לא נתמך: {role}
        </Typography>
      );
  }
};

export default UserDashboard;
