import React, { useEffect, useState } from 'react';
import ParentView from './views/ParentView';
import PatientView from './views/PatientView';
import AdminView from './views/AdminView';
import DoctorView from './views/DoctorView';
import { getUserRole, registerDeviceToken } from '../utils/api';
import { requestPermissionAndGetToken } from '../utils/fcm';

const UserDashboard = ({ userEmail }) => {
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const result = await getUserRole(userEmail);
        setRole(result.role);
        setUserData(result);
      } catch (err) {
        console.error('❌ Failed to fetch user role', err);
        setRole('unknown');
      }
    };

    if (userEmail) {
      fetchRole();
    }
  }, [userEmail]);

  useEffect(() => {
    const sendFcmToken = async () => {
      if (role === 'patient' && userData?.patient?.id) {
        const token = await requestPermissionAndGetToken();
        if (token) {
          try {
            await registerDeviceToken(userData.patient.id, token);
            console.log('📲 Device token registered successfully');
          } catch (err) {
            console.error('❌ Failed to register device token', err);
          }
        }
      }
    };

    sendFcmToken();
  }, [role, userData]);

  if (!role && userData === null) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>טוען נתוני משתמש...</h2>
      </div>
    );
  }

  if (!role && userData !== null) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>👋 שלום וברוך הבא!</h2>
        <p>המייל שלך זוהה בהצלחה, אך עדיין לא הוגדר לך תפקיד במערכת.</p>
        <p>אנא פנה למנהל לצורך שיוך רול.</p>
      </div>
    );
  }

  return (
    <>
      {role === 'doctor' && (
        <DoctorView
          doctorEmail={userEmail}
          doctorName={userData?.full_name || ''}
        />
      )}
      {role === 'admin' && <AdminView />}
      {role === 'parent' && <ParentView parentEmail={userEmail} />}
      {role === 'patient' && <PatientView patient={userData?.patient} />}
      {role === 'unknown' && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>שגיאה בזיהוי המשתמש</h2>
          <p>אנא ודא שהתחברת עם חשבון תקין</p>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
