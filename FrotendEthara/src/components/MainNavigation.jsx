import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  BusinessCenter as BusinessIcon,
  NotificationsNone as BellIcon,
  WorkOutline as BagIcon,
  SettingsOutlined as SettingsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const MainNavigation = ({ activeTab, onTabChange, totalEmployees = 0 }) => {
  const tabs = [
    { id: "employees", label: "Employee Management", icon: <PeopleIcon /> },
    { id: "attendance", label: "Attendance Management", icon: <BusinessIcon /> },
  ];

  return (
    <Card sx={{ borderRadius: 6, px: { xs: 2, md: 3 }, py: 2.5 }}>
      <CardContent sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <PeopleIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Employee Management System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage {totalEmployees} team members and their attendance
              </Typography>
            </Box>
          </Stack>

          
        </Stack>

        <Box mt={3} display="flex" flexWrap="wrap" gap={2}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              startIcon={tab.icon}
              onClick={() => onTabChange(tab.id)}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: activeTab === tab.id ? "0 10px 25px rgba(15, 40, 100, 0.15)" : "none",
                bgcolor: activeTab === tab.id ? "primary.main" : "#f5f7ff",
                color: activeTab === tab.id ? "primary.contrastText" : "text.primary",
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MainNavigation;
