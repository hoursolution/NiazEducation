import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Typography, CircularProgress, Button } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import * as XLSX from "xlsx";

const CustomToolbar = ({ selectedRows, handleExport }) => (
  <GridToolbarContainer
    style={{ display: "flex", justifyContent: "space-between" }}
  >
    <div>
      <GridToolbarFilterButton sx={{ color: "#14475a" }} />
      <GridToolbarColumnsButton sx={{ color: "#14475a" }} />
      <GridToolbarDensitySelector sx={{ color: "#14475a" }} />
      <GridToolbarExport sx={{ color: "#14475a" }} />
    </div>
    {/* <Button
      sx={{
        backgroundColor: selectedRows.length > 0 ? "#14475a" : "#cccccc",
        color: "#ffffff",
        fontWeight: 600,
        padding: "5px 15px",
        "&:hover": {
          backgroundColor: selectedRows.length > 0 ? "#0f3c4a" : "#cccccc",
        },
      }}
      disabled={selectedRows.length === 0}
      onClick={handleExport}
    >
      Export Selected
    </Button> */}
  </GridToolbarContainer>
);

const Reports = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "https://niazeducationscholarshipsbackend-production.up.railway.app/all-applicationss/"
        );
        setApplications(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // / Define the columns for the DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      valueGetter: (params) =>
        `${params.row.name || ""} ${params.row.last_name || ""}`,
    },
    { field: "father_name", headerName: "Father Name", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "date_of_birth", headerName: "Date of Birth", width: 130 },
    { field: "age", headerName: "Age", width: 70 },
    { field: "country", headerName: "Country", width: 130 },
    { field: "province", headerName: "Province", width: 130 },
    { field: "city", headerName: "City", width: 130 },
    { field: "city_of_origin", headerName: "City of Origin", width: 150 },
    { field: "mobile_no", headerName: "Mobile No", width: 130 },
    { field: "cnic_or_b_form", headerName: "CNIC/B-Form", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "village", headerName: "Village", width: 150 },
    { field: "address", headerName: "Address", width: 200 },

    // 🔹 corrected mappings
    {
      field: "current_grade",
      headerName: "Current Grade",
      width: 200,
    },
    {
      field: "school_interested_in",
      headerName: "School Interested In",
      width: 200,
    },
    {
      field: "grade_interested_in",
      headerName: "Grade Interested In",
      width: 200,
    },

    {
      field: "admission_fee_of_the_program",
      headerName: "Admission Fee",
      width: 150,
    },
    { field: "total_fee_of_the_program", headerName: "Total Fee", width: 150 },
    { field: "living_expenses", headerName: "Living Expenses", width: 150 },
    {
      field: "food_and_necessities_expenses",
      headerName: "Food & Necessities",
      width: 200,
    },
    { field: "transport_amount", headerName: "Transport Amount", width: 150 },
    { field: "other_amount", headerName: "Other Amount", width: 150 },
    {
      field: "expected_sponsorship_amount",
      headerName: "Expected Sponsorship Amount",
      width: 200,
    },

    { field: "household_income", headerName: "Household Income", width: 180 },

    { field: "status", headerName: "Status", width: 150 },

    // ✅ fixed child photo (array of objects)
    {
      field: "child_photo",
      headerName: "Child Picture",
      width: 150,
      renderCell: (params) => {
        const file = params.row.child_photo?.[0]?.file;
        return file ? (
          <img
            src={file}
            alt="Profile"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        ) : (
          "No Image"
        );
      },
    },
  ];

  // Prepare rows for the DataGrid
  const rows = applications.map((application) => ({
    ...application,
    id: application.id,
  }));

  // Export selected rows to Excel
  const handleExport = () => {
    const dataToExport = selectedRows.map((rowId) =>
      applications.find((application) => application.id === rowId)
    );
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedRows");
    XLSX.writeFile(workbook, "SelectedApplications.xlsx");
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ margin: "20px 0", color: "#14475a", fontWeight: 700 }}
      >
        Applications Data Report
      </Typography>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
        >
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            console.log("Selected Rows:", newSelectionModel); // Debug log
            setSelectedRows(newSelectionModel);
          }}
          components={{
            Toolbar: () => (
              <CustomToolbar
                selectedRows={selectedRows}
                handleExport={handleExport}
              />
            ),
          }}
          sx={{
            "& .MuiDataGrid-root": {
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#14475a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              textAlign: "center",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
              color: "#333333",
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(odd)": {
                backgroundColor: "#f9f9f9",
              },
              "&:hover": {
                backgroundColor: "#e6f7ff",
              },
            },
            "& .MuiCheckbox-root": {
              color: "#14475a !important",
            },
            "& .MuiDataGrid-selectedRowCount": {
              display: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#f1f1f1",
              padding: "10px 0",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "#d6eaff !important",
            },
            "& .MuiDataGrid-pagination": {
              color: "#14475a",
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#eaf5ff",
              borderBottom: "1px solid #ddd",
              padding: "5px 10px",
            },
          }}
        />
      )}
    </div>
  );
};

export default Reports;
