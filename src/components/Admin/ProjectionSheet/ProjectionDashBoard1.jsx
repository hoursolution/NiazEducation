import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Box,
  InputLabel,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { ThumbUp, Visibility } from "@mui/icons-material";

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL =
  "https://niazeducationscholarshipsbackend-production.up.railway.app";

// --- Modern Color Palette ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

// Custom GridToolbar
const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: cardBg, // Match table background
        borderBottom: `1px solid ${headerBg}`,
        padding: "8px",
        borderRadius: "8px 8px 0 0", // Match table border radius
      }}
    >
      <GridToolbarColumnsButton sx={{ color: textColor }} />
      <GridToolbarDensitySelector sx={{ color: textColor }} />
      {/* GridToolbarFilterButton is not used in the original CustomToolbar, but can be added if needed */}
      {/* <GridToolbarFilterButton sx={{ color: textColor }} /> */}
    </GridToolbarContainer>
  );
};

// Custom styled DataGrid component
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: `1px solid rgba(229, 231, 235, 0.5)`, // Subtle, translucent border
  borderRadius: "12px", // Softer, modern rounded corners
  overflow: "hidden", // Ensures clean rounded edges
  backgroundColor: "rgba(255, 255, 255, 0.95)", // Light glassmorphism background
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)", // Soft shadow for depth
  transition: "box-shadow 0.3s ease, transform 0.2s ease", // Smooth transitions
  "&:hover": {
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)", // Enhanced shadow on hover
    transform: "translateY(-2px)", // Subtle lift effect
  },

  "& .MuiDataGrid-columnHeaders": {
    background: `linear-gradient(180deg, ${headerBg}, rgba(243, 244, 246, 0.8))`, // Gradient header
    color: textColor,
    fontSize: "14px", // Slightly larger for readability
    fontWeight: 600,
    textTransform: "uppercase",
    borderBottom: `2px solid ${accentColor}`, // Bolder accent line
    padding: "8px 0", // Balanced padding
  },

  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: `1px solid rgba(229, 231, 235, 0.5)`, // Softer border
    textAlign: "center",
    whiteSpace: "normal",
    transition: "background-color 0.2s ease",
    "&:first-of-type": {
      borderLeft: "none",
    },
    "&:hover": {
      backgroundColor: "rgba(124, 58, 237, 0.05)", // Subtle hover effect
    },
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    whiteSpace: "normal",
    lineHeight: 1.3,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: 400,
    letterSpacing: "0.02em", // Slight letter spacing for elegance
  },

  "& .MuiDataGrid-cell": {
    borderLeft: `1px solid rgba(229, 231, 235, 0.5)`, // Consistent soft border
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    whiteSpace: "normal",
    wordWrap: "break-word",
    lineHeight: 1.5,
    padding: "10px 8px", // Increased padding for comfort
    fontSize: "13px", // Slightly larger text
    color: textColor,
    transition: "background-color 0.2s ease",
    "&:first-of-type": {
      borderLeft: "none",
    },
    "&:hover": {
      backgroundColor: "rgba(124, 58, 237, 0.05)", // Subtle cell hover
    },
  },

  "& .MuiDataGrid-row": {
    backgroundColor: cardBg,
    borderBottom: `1px solid rgba(229, 231, 235, 0.3)`, // Subtle row divider
    transition: "background-color 0.3s ease, transform 0.2s ease",
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(249, 250, 251, 0.85)", // Softer zebra striping
    },
    "&:hover": {
      backgroundColor: "rgba(124, 58, 237, 0.1)", // Vibrant hover effect
      transform: "translateY(-1px)", // Slight lift on row hover
    },
  },

  "& .MuiDataGrid-footerContainer": {
    background: `linear-gradient(180deg, rgba(243, 244, 246, 0.8), ${headerBg})`, // Matching gradient
    color: textColor,
    borderTop: `1px solid ${accentColor}`,
    borderRadius: "0 0 12px 12px",
    padding: "8px",
  },

  "& .MuiTablePagination-root": {
    color: textColor,
    fontSize: "13px",
    fontWeight: 500,
  },

  "& .MuiSvgIcon-root": {
    color: textColor,
    transition: "color 0.2s ease",
    "&:hover": {
      color: accentColor, // Accent color on icon hover
    },
  },

  // Improve accessibility
  "& .MuiDataGrid-cell:focus": {
    outline: `2px solid ${accentColor}`,
    outlineOffset: "-2px",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: `2px solid ${accentColor}`,
    outlineOffset: "-2px",
  },
}));
const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: "10px",
  // margin: "2px 4px",
  textTransform: "capitalize",
  borderRadius: "16px",
  width: "80px", // fixed width
  height: "26px", // fixed height
  padding: "2px 6px", // ensure internal spacing
  justifyContent: "center", // align icon + text nicely
}));

const ProjectionDashboard1 = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");

  const navigate = useNavigate();

  // Fetch all students at once
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/student-projection-data/`
      );

      const rawData = response.data.results || response.data; // works with or without pagination
      const processedData = rawData.flatMap((student) =>
        student.applications.map((app) => {
          const proj = app.projection || {};
          return {
            id: `${student.id}-${app.id}`,
            fullName: `${student.student_name || ""} ${
              student.last_name || ""
            }`,
            sponsor:
              student.select_donor.find((sd) => sd.application === app.id)
                ?.donor_name || "N/A",
            semester: proj.semester_number || "",
            amount: proj.total_amount || "",
            percentage: proj.percentage || "",
            status: proj.status || "Pending",
            dueDate: proj.challan_due_date
              ? new Date(proj.challan_due_date).toLocaleDateString("en-GB")
              : "",
            program: app.program_interested_in || "N/A",
            rawApplicationId: app.id,
          };
        })
      );

      setStudents(processedData);
      setFilteredStudents(processedData);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filters
  useEffect(() => {
    let filtered = [...students];
    if (searchText) {
      filtered = filtered.filter((s) =>
        s.fullName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterByStatus) {
      filtered = filtered.filter((s) => s.status === filterByStatus);
    }
    setFilteredStudents(filtered);
  }, [searchText, filterByStatus, students]);

  const handleViewProjection = (studentId) => {
    navigate(`/Admin/students/${studentId}/projections`);
  };

  const columns = [
    {
      field: "seq_no",
      headerName: "S.No",
      width: 70,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => filteredStudents.indexOf(params.row) + 1,
    },
    {
      field: "fullName",
      headerName: "Student Name",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "sponsor",
      headerName: "Sponsor Name",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1,
    },
    // {
    //   field: "percentage",
    //   headerName: "Sponsor %",
    //   minWidth: 100,
    //   flex: 0.6,
    //   renderCell: (params) =>
    //     params.value ? (
    //       params.value
    //     ) : (
    //       <Typography sx={{ color: "#EF4444", fontSize: "12px" }}>
    //         No Data
    //       </Typography>
    //     ),
    // },
    {
      field: "semester",
      headerName: "Month",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      flex: 0.6,
    },
    {
      field: "amount",
      headerName: "Total Amount",
      minWidth: 120,
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value ? (
          parseFloat(params.value).toLocaleString()
        ) : (
          <Typography sx={{ color: "#EF4444", fontSize: "12px" }}>
            No Data
          </Typography>
        ),
    },
    {
      field: "Status",
      headerName: "Fee Status",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let buttonColor = "";
        let buttonIcon = null;
        let label = params.row.status;

        const feeStatus = params.row.status;

        switch (feeStatus) {
          case "Paid":
            buttonColor = "#4CAF50"; // Green
            buttonIcon = (
              <CheckCircleIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Pending":
            buttonColor = "#2196F3"; // Blue
            buttonIcon = (
              <InfoIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Due":
            buttonColor = "#FF9800"; // Orange
            buttonIcon = (
              <WarningIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Overdue":
            buttonColor = "#F44336"; // Red
            buttonIcon = (
              <ErrorIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Finished":
            buttonColor = "#9E9E9E"; // Deep Purple for Completed
            buttonIcon = (
              <CheckCircleIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            label = "Completed";
            break;

          default:
            buttonColor = "#9E9E9E"; // Grey fallback
            buttonIcon = (
              <ThumbUp style={{ color: "#fff", fontSize: "14px" }} />
            );
        }

        return (
          <StyledButton
            variant="contained"
            startIcon={buttonIcon}
            size="small"
            style={{
              backgroundColor: buttonColor,
              color: "#fff",
            }}
          >
            {label}
          </StyledButton>
        );
      },
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      minWidth: 120,
      flex: 0.6,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "viewProjection",
      headerName: "View Projection",
      width: 150,
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Box
            onClick={() => handleViewProjection(params.row.rawApplicationId)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#0a5a39",
              backgroundColor: "#aaa",
              padding: "4px 6px ",
              borderRadius: "6px",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Visibility sx={{ mr: 0.5, fontSize: "16px" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
              View
            </Typography>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh", // full screen height
        display: "flex",
        flexDirection: "column",
        px: { xs: 2, sm: 3 },
        py: 2,
      }}
    >
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          p: 2,
          backgroundColor: cardBg,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          label="Search by Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: { sm: 300 } }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Due">Due</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Finished">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data Grid */}
      {loading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{ color: accentColor }}
          />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={3} color="#EF4444">
          <Typography variant="h6">{error}</Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <StyledDataGrid
            rows={filteredStudents}
            columns={columns}
            density="compact"
            disableRowSelectionOnClick
            // hideFooter
            // autoHeight={false}
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjectionDashboard1;
