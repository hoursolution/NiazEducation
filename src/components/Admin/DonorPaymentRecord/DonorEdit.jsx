import React, { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DonorForm from "../Profiles/DonorForm";

const EditDonor = ({ donorId, onClose, onDonorUpdated }) => {
  const [alert, setAlert] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/donors/${donorId}/`);
        setInitialData(res.data);
      } catch (error) {
        console.error("Error fetching donor:", error);
        setAlert({
          severity: "error",
          message: "Failed to load donor data.",
        });
      }
    };
    if (donorId) fetchDonor();
  }, [donorId]);

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const onSubmit = async (data) => {
    try {
      await axios.put(`${BASE_URL}/api/donors/${donorId}/`, data);
      setAlert({
        severity: "success",
        message: "Donor profile updated successfully!",
      });
      if (onDonorUpdated) {
        onDonorUpdated(); // ✅ refresh donor list
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating Donor profile:", error);
      console.error("Error data:", error.response?.data);

      if (error.response && error.response.data) {
        setAlert({ severity: "error", message: error.response.data });
      } else {
        setAlert({
          severity: "error",
          message: "Failed to update Donor profile.",
        });
      }
    }
  };

  return (
    <>
      {initialData && (
        <DonorForm initialValues={initialData} onSubmit={onSubmit} />
      )}
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity={alert?.severity}
        >
          {alert?.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default EditDonor;
