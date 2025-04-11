import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box, Collapse
} from '@mui/material';
import { getChildrenAndTasks } from '../../utils/api';
import TodayTaskFormParent from '../TodayTaskFormParent';
import TaskHistoryList from '../TaskHistoryList';

const ParentView = ({ parentEmail }) => {
  const [children, setChildren] = useState([]);
  const [showTodayForm, setShowTodayForm] = useState({});
  const [showHistory, setShowHistory] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchChildren = async () => {
    try {
      const data = await getChildrenAndTasks(parentEmail);
      setChildren(data);
    } catch (err) {
      console.error('שגיאה בטעינת הילדים:', err);
    }
  };

  useEffect(() => {
    if (parentEmail) fetchChildren();
  }, [parentEmail]);

  const toggleTodayForm = (id) => {
    setShowTodayForm((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHistory = (id) => {
    setShowHistory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateTaskInState = (childId, updatedTask) => {
    setChildren(prev =>
      prev.map(child =>
        child.id === childId
          ? {
              ...child,
              tasks: child.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              ),
            }
          : child
      )
    );
  };

  return (
    <Box>
      {children.length === 0 ? (
        <Typography variant="body1">אין ילדים להצגה</Typography>
      ) : (
        children.map((child) => {
          const todayTask = child.tasks.find(task => task.date === todayStr);
          return (
            <Card key={child.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">{child.name}</Typography>

                {todayTask && (
                  <Typography sx={{ mt: 1 }}>
                    📝 {todayTask.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  {todayTask && (
                    <Button
                      variant="outlined"
                      onClick={() => toggleTodayForm(child.id)}
                    >
                      {showTodayForm[child.id] ? 'סגור מענה' : 'ענה למשימה'}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    onClick={() => toggleHistory(child.id)}
                  >
                    {showHistory[child.id] ? 'הסתר היסטוריה' : 'הצג היסטוריה'}
                  </Button>
                </Box>

                {todayTask && (
                  <Collapse in={showTodayForm[child.id]}>
                    <TodayTaskFormParent
                      task={todayTask}
                      patientId={child.id}
                      defaultDate={new Date(todayTask.date)}
                      patientName={child.name}
                      onSubmitSuccess={(updatedTask) =>
                        updateTaskInState(child.id, updatedTask)
                      }
                      onClose={() => toggleTodayForm(child.id)}
                    />


                  </Collapse>
                )}

                <Collapse in={showHistory[child.id]}>
                  <TaskHistoryList tasks={child.tasks} />
                </Collapse>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default ParentView;
