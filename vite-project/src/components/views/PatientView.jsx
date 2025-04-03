import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getChildrenAndTasks, patchTask } from '../../utils/api';
import TaskList from './TaskList';

const ParentView = ({ parentEmail }) => {
  const [children, setChildren] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentEmail) return;
    const fetchData = async () => {
      try {
        const data = await getChildrenAndTasks(parentEmail);
        setChildren(data);
      } catch (err) {
        console.error('❌ Failed to fetch children and tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentEmail]);

  const handleExpand = (childId) => {
    setExpandedId(expandedId === childId ? null : childId);
  };

  const handleTaskUpdate = async (childId, updatedTask) => {
    try {
      await patchTask(updatedTask.task_id, updatedTask);
      const updatedChildren = await getChildrenAndTasks(parentEmail);
      setChildren(updatedChildren);
    } catch (err) {
      console.error('❌ Failed to update task:', err);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        👨‍👧‍👦 בחר ילד למענה
      </Typography>

      {children.map((child) => {
        const todayTask = child.tasks?.find((t) => t.date === today);
        return (
          <Card
            key={child.id}
            sx={{
              mb: 2,
              backgroundColor: '#f9f9f9',
              border: expandedId === child.id ? '2px solid #1976d2' : '1px solid #ccc',
              transition: '0.3s',
            }}
          >
            <CardActions onClick={() => handleExpand(child.id)} sx={{ cursor: 'pointer' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>{child.name}</Typography>
              <IconButton>
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>

            {todayTask && (
              <Typography sx={{ px: 2, pb: 1 }} variant="body2">
                📝 משימת היום: {todayTask.description}
              </Typography>
            )}

            <Collapse in={expandedId === child.id} timeout="auto" unmountOnExit>
              <CardContent>
                <TaskList
                  tasks={child.tasks}
                  patient={child}
                  onUpdate={(updated) => handleTaskUpdate(child.id, updated)}
                />
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </Box>
  );
};

export default ParentView;
