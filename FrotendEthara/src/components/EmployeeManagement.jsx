import React, { useMemo, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Apartment as ApartmentIcon,
} from "@mui/icons-material";

const EmployeeManagement = ({
  employees,
  addEmployee,
  deleteEmployee,
  fetchAttendance,
  onViewAttendance,
  isSubmitting = false,
}) => {
  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter((employee) =>
      `${employee.full_name} ${employee.employee_id} ${employee.department}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 5, p: 2.5 }}>
          <CardContent sx={{ p: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: "#e9f1ff", color: "primary.main" }}>
                <PersonAddIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Add New Employee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capture employee details to grow the team
                </Typography>
              </Box>
            </Stack>
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddEmployee}
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Employee"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 5, p: 2.5, height: "100%" }}>
          <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Employee List
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {employees.length} teammates in the roster
                </Typography>
              </Box>
              <TextField
                placeholder="Search employee"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 999, bgcolor: "#f5f7ff" },
                }}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {filteredEmployees.length === 0 ? (
                <Box textAlign="center" py={6} color="text.secondary">
                  No employees match your search.
                </Box>
              ) : (
                filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id || employee._id || employee.employee_id}
                    sx={{
                      mb: 2,
                      px: 2,
                      py: 1.5,
                      borderRadius: 4,
                      boxShadow: "0 12px 30px rgba(15, 40, 100, 0.06)",
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#eff4ff", color: "primary.main" }}>
                          {employee.full_name?.[0] || "E"}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{employee.full_name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {employee.employee_id} • {employee.department}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          aria-label="view"
                          onClick={() => {
                            fetchAttendance(employee.employee_id);
                            onViewAttendance?.(employee.employee_id);
                          }}
                          sx={{ bgcolor: "#e9f1ff" }}
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => deleteEmployee(employee)} sx={{ bgcolor: "#ffeaea" }}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Card>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EmployeeManagement;
