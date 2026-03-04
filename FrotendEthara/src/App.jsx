import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, Box, Alert, Snackbar, Grid, Card, CardContent, Skeleton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import api from "./services/api";

const EmployeeManagement = lazy(() => import("./components/EmployeeManagement"));
const AttendanceManagement = lazy(() => import("./components/AttendanceManagement"));
const MainNavigation = lazy(() => import("./components/MainNavigation"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5983",
      dark: "#9a0036",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      color: "#1976d2",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
          border: "1px solid #e0e0e0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getErrorMessage = (error) => {
    return error?.response?.data?.detail || "Something went wrong. Please try again.";
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get("/api/employees");
      setEmployees(response.data || []);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };

  const addEmployee = async (employeeData) => {
    if (!employeeData.employee_id || !employeeData.full_name || !employeeData.email || !employeeData.department) {
      showSnackbar("Please fill all fields!", "error");
      return false;
    }
    try {
      const response = await api.post("/api/employees", employeeData);
      setEmployees((prev) => [...prev, response.data]);
      showSnackbar("Employee added successfully!");
      return true;
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
      return false;
    }
  };

  const deleteEmployee = async (employee) => {
    if (!employee?.id) return;
    try {
      await api.delete(`/api/employees/${employee.id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
      if (selectedEmployee === employee.employee_id) {
        setSelectedEmployee(null);
        setAttendance([]);
      }
      showSnackbar(`Employee ${employee.full_name} deleted successfully!`);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };

  const fetchAttendance = async (employeeId) => {
    if (!employeeId) {
      setAttendance([]);
      setSelectedEmployee(null);
      setAttendanceLoading(false);
      return;
    }
    setAttendanceLoading(true);
    try {
      const response = await api.get(`/api/attendance/employee/${employeeId}`);
      setAttendance(response.data || []);
      setSelectedEmployee(employeeId);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const addAttendance = async (attendanceData) => {
    if (!attendanceData.employee_id || !attendanceData.date) {
      showSnackbar("Please select employee and date!", "error");
      return false;
    }
    try {
      const payload = {
        employee_id: attendanceData.employee_id,
        date: attendanceData.date,
        status: attendanceData.status,
      };
      const response = await api.post("/api/attendance", payload);
      if (selectedEmployee === attendanceData.employee_id) {
        setAttendance((prev) => [response.data, ...prev]);
      }
      const employee = employees.find((emp) => emp.employee_id === attendanceData.employee_id);
      showSnackbar(`Attendance marked for ${employee?.full_name || "employee"}!`);
      return true;
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
      return false;
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Router>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense
          fallback={
            <Box sx={{ mt: 4 }}>
              <Skeleton variant="text" width="30%" height={40} animation="wave" sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="50%" animation="wave" sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" height={200} animation="wave" />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="50%" animation="wave" sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" height={300} animation="wave" />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          }
        >
          <MainNavigation />

          <Routes>
            <Route
              path="/"
              element={<Navigate to="/employees" replace />}
            />
            <Route
              path="/employees"
              element={
                <EmployeeManagement
                  employees={employees}
                  addEmployee={addEmployee}
                  deleteEmployee={deleteEmployee}
                  fetchAttendance={fetchAttendance}
                />
              }
            />
            <Route
              path="/attendance"
              element={
                <AttendanceManagement
                  employees={employees}
                  attendance={attendance}
                  selectedEmployee={selectedEmployee}
                  addAttendance={addAttendance}
                  fetchAttendance={fetchAttendance}
                  attendanceLoading={attendanceLoading}
                />
              }
            />
          </Routes>
        </Suspense>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Router>
  );
}

function AppWithTheme() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
