import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import SkeletonLoader from "../shared/SkeletonLoader";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AttendanceManagement = ({
  employees,
  attendance,
  selectedEmployee,
  addAttendance,
  fetchAttendance,
  attendanceLoading = false,
  isSubmitting = false,
}) => {
  const [newAttendance, setNewAttendance] = useState({
    employee_id: "",
    date: null,
    status: "present",
  });
  const [viewingEmployee, setViewingEmployee] = useState(selectedEmployee);

  useEffect(() => {
    setViewingEmployee(selectedEmployee);
  }, [selectedEmployee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance({ ...newAttendance, [name]: value });
    if (name === "employee_id") {
      fetchAttendance(value);
      setViewingEmployee(value);
    }
  };

  const handleStatusChange = (e) => {
    setNewAttendance({ ...newAttendance, status: e.target.value });
  };

  const handleAddAttendance = async () => {
    const attendanceData = {
      employee_id: newAttendance.employee_id,
      date: newAttendance.date ? newAttendance.date.format('YYYY-MM-DD') : '',
      status: newAttendance.status,
    };
    const success = await addAttendance(attendanceData);
    if (success) {
      setNewAttendance({
        employee_id: "",
        date: null,
        status: "present",
      });
    }
  };

  const selectedEmployeeData = employees.find(
    (emp) => emp.employee_id === viewingEmployee
  );

  const filteredAttendance = viewingEmployee
    ? attendance.filter((att) => att.employee_id === viewingEmployee)
    : [];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 5, p: 2.5 }}>
            <CardContent sx={{ p: 0 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: "#e9f1ff", color: "primary.main" }}>
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Mark Attendance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track presence with a single tap
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Select Employee</InputLabel>
                    <Select
                      name="employee_id"
                      value={newAttendance.employee_id}
                      onChange={handleInputChange}
                      label="Select Employee"
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.employee_id}>
                          {employee.full_name} ({employee.employee_id})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="From"
                    value={newAttendance.date}
                    onChange={(newValue) => setNewAttendance({ ...newAttendance, date: newValue })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="To"
                    value={newAttendance.date}
                    onChange={(newValue) => setNewAttendance({ ...newAttendance, date: newValue })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={newAttendance.status} onChange={handleStatusChange} label="Status">
                      <MenuItem value="present">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography variant="body2">Present</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="absent">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CancelIcon color="error" fontSize="small" />
                          <Typography variant="body2">Absent</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAttendance}
                    fullWidth
                    size="large"
                    disabled={isSubmitting || !newAttendance.employee_id || !newAttendance.date}
                  >
                    {isSubmitting ? "Saving..." : "Mark Attendance"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 5, p: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: "#e3f6ff", color: "primary.main" }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Attendance Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stay updated with real-time status
                  </Typography>
                </Box>
              </Stack>

              {viewingEmployee ? (
                <>
                  <Card sx={{ mb: 2, p: 2, borderRadius: 4, bgcolor: "#f6f9ff" }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                      <Avatar sx={{ bgcolor: "#fff", color: "primary.main" }}>
                        {selectedEmployeeData?.full_name?.[0] || "E"}
                      </Avatar>
                      <Box flex={1}>
                        <Typography fontWeight={600}>{selectedEmployeeData?.full_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID {selectedEmployeeData?.employee_id} • {selectedEmployeeData?.department}
                        </Typography>
                      </Box>
                      <Chip icon={<AccessTimeIcon />} label={`${filteredAttendance.length} records`} color="primary" variant="outlined" />
                    </Stack>
                  </Card>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                    {attendanceLoading ? (
                      <SkeletonLoader type="list" count={5} />
                    ) : filteredAttendance.length > 0 ? (
                      filteredAttendance.map((record) => (
                        <Card
                          key={record.id || record._id}
                          sx={{
                            mb: 2,
                            px: 2,
                            py: 1.5,
                            borderRadius: 4,
                            boxShadow: "0 12px 30px rgba(15, 40, 100, 0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Stack spacing={0.5}>
                            <Typography fontWeight={600}>{dayjs(record.date).format("MMM D, YYYY")}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(record.date).format("dddd")}
                            </Typography>
                          </Stack>
                          <Chip
                            icon={record.status === "present" ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                            label={record.status === "present" ? "Present" : "Absent"}
                            color={record.status === "present" ? "success" : "error"}
                            variant={record.status === "present" ? "outlined" : "filled"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Card>
                      ))
                    ) : (
                      <Box textAlign="center" py={6} color="text.secondary">
                        No attendance records found for this employee.
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box textAlign="center" py={6} color="text.secondary">
                  Select an employee to view attendance records.
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default AttendanceManagement;
