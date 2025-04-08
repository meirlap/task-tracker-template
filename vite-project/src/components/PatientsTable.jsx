import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, TextField
} from '@mui/material';
import { Edit, Delete, Save } from '@mui/icons-material';
import PatientDetailsRow from './PatientDetailsRow';
import { getTasksForPatient } from '../utils/api';

const PatientsTable = ({
  patients,
  filterName,
  filterId,
  filterEmail,
  editRowId,
  setEditRowId,
  editedData,
  setEditedData,
  onSaveEdit,
  onDelete,
  onSelect,
  selectedPatient,
  setPatients
}) => {
  const handleEditClick = (patient) => {
    setEditRowId(patient.id);
    setEditedData({
      name: patient.name || '',
      israeli_id: patient.israeli_id || '',
      email: patient.email || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefreshTasks = async (patientId) => {
    const newTasks = await getTasksForPatient(patientId, 30);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, tasks: newTasks } : p
      )
    );
  };

  const filteredPatients = patients.filter((p) =>
    (!filterName || p.name?.toLowerCase().includes(filterName.toLowerCase())) &&
    (!filterId || String(p.israeli_id || '').includes(filterId)) &&
    (!filterEmail || p.email?.toLowerCase().includes(filterEmail.toLowerCase()))
  );

  return (
    <TableContainer sx={{ width: '100%' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ height: 40 }}>
            <TableCell>שם</TableCell>
            <TableCell>ת"ז</TableCell>
            <TableCell>אימייל</TableCell>
            <TableCell>הורה</TableCell>
            <TableCell>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPatients.map((patient) => (
            <React.Fragment key={patient.id}>
              <TableRow
                hover
                onClick={() => onSelect(patient)}
                sx={{ cursor: 'pointer', height: 40 }}
              >
                {editRowId === patient.id ? (
                  <>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        name="israeli_id"
                        value={editedData.israeli_id}
                        onChange={handleInputChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        name="email"
                        value={editedData.email}
                        onChange={handleInputChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      {patient.parents?.[0]?.full_name || '—'}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <IconButton onClick={() => onSaveEdit(patient.id)}>
                        <Save />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ py: 0.5 }}>{patient.name}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{patient.israeli_id}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{patient.email}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      {patient.parents?.[0]?.full_name || '—'}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(patient);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(patient.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>

              {selectedPatient?.id === patient.id && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <PatientDetailsRow
                      patient={patient}
                      tasks={patient.tasks}
                      refreshTasks={() => handleRefreshTasks(patient.id)}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientsTable;
