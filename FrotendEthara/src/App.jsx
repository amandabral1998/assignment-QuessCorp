import { useState, useEffect, Suspense, lazy } from "react";
import { Container, Box, Alert, Snackbar, Grid, Card, CardContent, Skeleton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import api from "./services/api";

const EmployeeManagement = lazy(() => import("./components/EmployeeManagement"));
const AttendanceManagement = lazy(() => import("./components/AttendanceManagement"));
const MainNavigation = lazy(() => import("./components/MainNavigation"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1369dc",
      light: "#4d8ff5",
      dark: "#0b3f8a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1ec6ff",
      contrastText: "#0b1b3a",
    },
    background: {
      default: "#e8ecf9",
      paper: "#ffffff",
    },
    text: {
      primary: "#0b1b3a",
      secondary: "#6c7f99",
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      color: "#0b1b3a",
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
          boxShadow: "0 20px 45px rgba(15, 40, 100, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 999,
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
  const [employeeSubmitting, setEmployeeSubmitting] = useState(false);
  const [attendanceSubmitting, setAttendanceSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
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
    setEmployeeSubmitting(true);
    try {
      const response = await api.post("/api/employees", employeeData);
      setEmployees((prev) => [...prev, response.data]);
      showSnackbar("Employee added successfully!");
      return true;
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
      return false;
    } finally {
      setEmployeeSubmitting(false);
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
    setAttendanceSubmitting(true);
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
    } finally {
      setAttendanceSubmitting(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleViewAttendanceFromEmployees = (employeeId) => {
    fetchAttendance(employeeId);
    setActiveTab("attendance");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #eef2ff 0%, #f7f8fc 40%, #fdfdff 100%)",
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Suspense
            fallback={
              <Box sx={{ mt: 4 }}>
                <Skeleton variant="rounded" height={120} animation="wave" sx={{ mb: 3, borderRadius: 4 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Skeleton variant="text" width="50%" animation="wave" sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={220} animation="wave" />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Skeleton variant="text" width="50%" animation="wave" sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={280} animation="wave" />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            }
          >
            <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} totalEmployees={employees.length} />

            <Box sx={{ mt: 3 }}>
              {activeTab === "employees" ? (
                <EmployeeManagement
                  employees={employees}
                  addEmployee={addEmployee}
                  deleteEmployee={deleteEmployee}
                  fetchAttendance={fetchAttendance}
                  onViewAttendance={handleViewAttendanceFromEmployees}
                  isSubmitting={employeeSubmitting}
                />
              ) : (
                <AttendanceManagement
                  employees={employees}
                  attendance={attendance}
                  selectedEmployee={selectedEmployee}
                  addAttendance={addAttendance}
                  fetchAttendance={fetchAttendance}
                  attendanceLoading={attendanceLoading}
                  isSubmitting={attendanceSubmitting}
                />
              )}
            </Box>
          </Suspense>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
