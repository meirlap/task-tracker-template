import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  CardContent
} from '@mui/material';
import { replaceTasksFromDate } from '../utils/api';
import FormContainer from './common/FormContainer';

const TodayTaskForm = ({ task, patientName, onSubmitSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    completed: '',
    reason_not_completed: '',
    allergy_reaction: '',
    notes: ''
  });

  useEffect(() => {
    if (formData.completed === 'true') {
      setFormData(prev => ({ ...prev, reason_not_completed: '' }));
    } else if (formData.completed === 'false') {
      setFormData(prev => ({ ...prev, allergy_reaction: '' }));
    }
  }, [formData.completed]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const result = await replaceTasksFromDate({
        patient_id: task.patient_id,
        description: task.description,
        from_date: task.date,
        to_date: task.date,
        completed: formData.completed === 'true',
        reason_not_completed: formData.reason_not_completed,
        allergy_reaction: parseInt(formData.allergy_reaction) || null,
        notes: formData.notes,
      });

      console.log('Task updated successfully via replace-from-date:', result);

      if (onSubmitSuccess) onSubmitSuccess(result);
      if (onClose) onClose();
    } catch (err) {
      console.error('Error updating task via replace-from-date:', err);
    }
  };

  return (
    <CardContent>
      <FormContainer>
        <Typography variant="subtitle1">
          📝 {`משימה עבור ${patientName} בתאריך ${task.date}`}: {task.description}
        </Typography>

        <TextField
          select
          fullWidth
          name="completed"
          label="האם בוצע?"
          value={formData.completed}
          onChange={handleChange}
        >
          <MenuItem value="true">כן</MenuItem>
          <MenuItem value="false">לא</MenuItem>
        </TextField>

        {formData.completed === "false" && (
          <TextField
            select
            fullWidth
            name="reason_not_completed"
            label="סיבת אי-ביצוע"
            value={formData.reason_not_completed}
            onChange={handleChange}
          >
            <MenuItem value="מחלה">מחלה</MenuItem>
            <MenuItem value="שכחתי">שכחתי</MenuItem>
            <MenuItem value="אחר">אחר</MenuItem>
          </TextField>
        )}

        {formData.completed === "true" && (
          <TextField
            select
            fullWidth
            name="allergy_reaction"
            label="דירוג תגובה אלרגית"
            value={formData.allergy_reaction}
            onChange={handleChange}
          >
            <MenuItem value={0}>0 - אין</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4 - חמורה</MenuItem>
          </TextField>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          name="notes"
          label="הערות"
          value={formData.notes}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          שלח משוב
        </Button>
      </FormContainer>
    </CardContent>
  );
};

export default TodayTaskForm;
