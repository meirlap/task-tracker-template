import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import { updateTodayTask } from '../../utils/api';

const TaskList = ({ patient, updateTaskInList }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [formData, setFormData] = useState({
    completed: '',
    reason_not_completed: '',
    allergy_reaction: '',
    notes: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const todayTask = patient.tasks?.find(task => task.date === today);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedTask = await updateTodayTask({
        patient_id: patient.id,
        task_date: todayTask.date,
        completed: formData.completed === 'true',
        reason_not_completed: formData.reason_not_completed,
        allergy_reaction: Number(formData.allergy_reaction),
        notes: formData.notes
      });

      updateTaskInList(updatedTask);
      setShowFeedbackForm(false);
      console.log("✅ Feedback submitted successfully");
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (!todayTask) return null;

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h6">{patient.full_name}</Typography>

        {!showFeedbackForm ? (
          <>
            <Typography sx={{ mt: 1 }}>
              📝 משימה להיום: {todayTask.description}
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setShowFeedbackForm(true)}>
              מענה למשימה
            </Button>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              📝 משימה להיום: {todayTask.description}
            </Typography>

            <TextField
              select
              fullWidth
              name="completed"
              label="האם בוצע?"
              value={formData.completed}
              onChange={handleChange}
              sx={{ mt: 2 }}
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
                sx={{ mt: 2 }}
              >
                <MenuItem value="שכחתי">שכחתי</MenuItem>
                <MenuItem value="מחסור במוצר">מחסור במוצר</MenuItem>
                <MenuItem value="מחלה">מחלה</MenuItem>
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
                sx={{ mt: 2 }}
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
              sx={{ mt: 2 }}
              placeholder=""
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              שלח משוב
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
