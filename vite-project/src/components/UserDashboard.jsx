import React, { useEffect, useState } from 'react';
import ParentView from './views/ParentView';
import PatientView from './views/PatientView';
import { getUserRole } from '../utils/api';

const UserDashboard = ({ userEmail }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await getUserRole(userEmail);
        setRole(res.role);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, [userEmail]);

  if (!role) return <p>Loading...</p>;

  if (role === 'parent') return <ParentView parentEmail={userEmail} />;
  if (role === 'patient') return <PatientView patientEmail={userEmail} />;

  return <p>Unsupported user role: {role}</p>;
};

export default UserDashboard;
