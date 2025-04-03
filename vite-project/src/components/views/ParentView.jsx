import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Collapse,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import { getChildrenAndTasks, patchTask } from '../../utils/api';

const ParentView = ({ parentEmail }) => {
  const [children, setChildren] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [historyShown, setHistoryShown] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (parentEmail) {
      getChildrenAndTasks(parentEmail).then((data) => setChildren(data));
    }
  }, [parentEmail]);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleHistory = (id) => {
    setHistoryShown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (e, id) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e, taskId, id) => {
    e.preventDefault();
    try {
      await patchTask(taskId, formData[id]);
      alert('עודכן בהצלחה');
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div>
      <Typography variant="h6">📚 רשימת הילדים שלך</Typography>
      {children.map((child) => {
        const todayTask = child.tasks.find((t) => new Date(t.date).toDateString() === new Date().toDateString());
        const otherTasks = child.tasks.filter((t) => t.id !== todayTask?.id);
        return (
          <Card key={child.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">{child.name}</Typography>

              {todayTask && (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    ✏️ משימה להיום: {todayTask.description}
                  </Typography>
                  <Button size="small" onClick={() => toggleExpanded(child.id)}>
                    {expandedId === child.id ? 'בטל מענה' : 'ענה למשימה'}
                  </Button>
                  <Collapse in={expandedId === child.id} timeout="auto" unmountOnExit>
                    <form onSubmit={(e) => handleSubmit(e, todayTask.id, child.id)}>
                      <TextField
                        fullWidth
                        select
                        label="האם בוצע?"
                        name="completed"
                        value={formData[child.id]?.completed || ''}
                        onChange={(e) => handleChange(e, child.id)}
                        sx={{ mt: 2 }}
                      >
                        <MenuItem value="true">כן</MenuItem>
                        <MenuItem value="false">לא</MenuItem>
                      </TextField>
                      {formData[child.id]?.completed === 'false' && (
                    <TextField
                      fullWidth
                      select
                      label="סיבת אי-ביצוע"
                      name="reason_not_completed"
                      value={formData[child.id]?.reason_not_completed || ''}
                      onChange={(e) => handleChange(e, child.id)}
                      sx={{ mt: 2 }}
                    >
                      <MenuItem value="מחלה">מחלה</MenuItem>
                      <MenuItem value="שכחה">שכחה</MenuItem>
                      <MenuItem value="אחר">אחר</MenuItem>
                    </TextField>
                  )}

                  {formData[child.id]?.completed === 'true' && (
                    <TextField
                      fullWidth
                      select
                      label="דירוג תגובה אלרגית"
                      name="allergy_reaction"
                      value={formData[child.id]?.allergy_reaction || ''}
                      onChange={(e) => handleChange(e, child.id)}
                      sx={{ mt: 2 }}
                    >
                      <MenuItem value="0">0 - אין תגובה</MenuItem>
                      <MenuItem value="1">1 - קלה</MenuItem>
                      <MenuItem value="2">2 - בינונית</MenuItem>
                      <MenuItem value="3">3 - חמורה</MenuItem>
                      <MenuItem value="4">4 - חמורה מאוד</MenuItem>
                    </TextField>
                  )}

                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="הערות"
                        name="notes"
                        value={formData[child.id]?.notes || ''}
                        onChange={(e) => handleChange(e, child.id)}
                        sx={{ mt: 2 }}
                      />
                      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        שלח משוב
                      </Button>
                    </form>
                  </Collapse>
                </>
              )}
            </CardContent>

            <CardActions>
              <Button onClick={() => toggleHistory(child.id)}>
                {historyShown[child.id] ? 'הסתר היסטוריה' : 'הצג היסטוריה'}
              </Button>
            </CardActions>

            <Collapse in={historyShown[child.id]} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="subtitle2">🗂️ היסטוריית משימות:</Typography>
                {otherTasks.map((t) => (
                  <Typography key={t.id} variant="body2">
                    {t.description} | {t.date} | {t.completed ? '✅' : '❌'}
                  </Typography>
                ))}
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </div>
  );
};

export default ParentView;
