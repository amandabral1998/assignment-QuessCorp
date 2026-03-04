import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { People as PeopleIcon, BusinessCenter as BusinessIcon } from '@mui/icons-material';

const MainNavigation = () => {
  const location = useLocation();
  const isEmployeesActive = location.pathname === '/' || location.pathname === '/employees';
  const isAttendanceActive = location.pathname === '/attendance';

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 4, bgcolor: 'white' }}>
      <Toolbar>
        
        <Box>
          <Button
            component={RouterLink}
            to="/employees"
            startIcon={<PeopleIcon />}
            sx={{
              mr: 2,
              color: isEmployeesActive ? 'primary.main' : 'text.primary',
              borderBottom: isEmployeesActive ? '2px solid' : 'none',
              borderColor: 'primary.main',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8,
              },
            }}
          >
            Employee Management
          </Button>
          <Button
            component={RouterLink}
            to="/attendance"
            startIcon={<BusinessIcon />}
            sx={{
              color: isAttendanceActive ? 'primary.main' : 'text.primary',
              borderBottom: isAttendanceActive ? '2px solid' : 'none',
              borderColor: 'primary.main',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8,
              },
            }}
          >
            Attendance Management
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavigation;
