import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const EmployeeManagement = ({ employees, addEmployee, deleteEmployee, fetchAttendance }) => {
  const navigate = useNavigate();
  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    const success = await addEmployee(newEmployee);
    if (success) {
      setNewEmployee({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Add New Employee
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="employee_id"
                  value={newEmployee.employee_id}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={newEmployee.full_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddEmployee}
                  fullWidth
                >
                  Add Employee
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Employee List
            </Typography>
            <List>
              {employees.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  No employees found. Add some employees to get started.
                </Typography>
              ) : (
                employees.map((employee) => (
                  <ListItem
                    key={employee.id || employee._id || employee.employee_id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="view"
                          onClick={() => {
                            fetchAttendance(employee.employee_id);
                            navigate("/attendance");
                          }}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteEmployee(employee)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={employee.full_name}
                      secondary={
                        <>
                          <Box component="span" display="block">
                            ID: {employee.employee_id}
                          </Box>
                          <Box component="span" display="block">
                            {employee.department}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EmployeeManagement;
