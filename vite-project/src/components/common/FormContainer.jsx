import React from 'react';
import { Box } from '@mui/material';

const FormContainer = ({ children }) => (
  <Box
    sx={{
      maxWidth: 500,
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      mt: 2,
      px: 2,  // ריווח פנימי
    }}
  >
    {children}
  </Box>
);

export default FormContainer;
