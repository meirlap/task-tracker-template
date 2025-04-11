import React, { useState } from 'react';
import { updateTodayTask } from '../utils/api';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

const TodayTaskFormParent = ({
  patientId,
  defaultDate,
  existingTask,
  onSubmitSuccess,
  onClose
}) => {
  const [completed, setCompleted] = useState(existingTask?.completed || false);
  const [reasonNotCompleted, setReasonNotCompleted] = useState('');
  const [allergyReaction, setAllergyReaction] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      patient_id: patientId,
      task_date: defaultDate?.toISOString().split('T')[0],  
      completed,
      reason_not_completed: completed ? '' : reasonNotCompleted,
      allergy_reaction: completed ? allergyReaction : null,
      notes
    };
  
    try {
      const updated = await updateTodayTask(payload);
      onSubmitSuccess?.(updated);
      onClose?.();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 2 }} dir="rtl">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          דיווח על משימה ל־{defaultDate?.toLocaleDateString()}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Button
            variant={completed ? 'contained' : 'outlined'}
            color={completed ? 'success' : 'primary'}
            onClick={() => setCompleted(!completed)}
            fullWidth
            sx={{ mt: 1 }}
          >
            {completed ? 'סומן כבוצע ✅' : 'סמן משימה כבוצעה'}
          </Button>

          {!completed && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="reason-label">סיבה לאי ביצוע</InputLabel>
              <Select
                labelId="reason-label"
                value={reasonNotCompleted}
                label="סיבה לאי ביצוע"
                onChange={(e) => setReasonNotCompleted(e.target.value)}
              >
                <MenuItem value="שכחתי">שכחתי</MenuItem>
                <MenuItem value="מחסור במוצר בבית">מחסור במוצר בבית</MenuItem>
                <MenuItem value="מחלה">מחלה</MenuItem>
                <MenuItem value="אחר">אחר</MenuItem>
              </Select>
            </FormControl>
          )}

          {completed && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="allergy-select-label">דירוג תגובה אלרגית</InputLabel>
              <Select
                labelId="allergy-select-label"
                value={allergyReaction}
                label="דירוג תגובה אלרגית"
                onChange={(e) => setAllergyReaction(Number(e.target.value))}
              >
                <MenuItem value={0}>0 - אין תגובה</MenuItem>
                <MenuItem value={1}>1 - קלה</MenuItem>
                <MenuItem value={2}>2 - בינונית</MenuItem>
                <MenuItem value={3}>3 - חמורה</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            label="הערות"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            שלח
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodayTaskFormParent;
