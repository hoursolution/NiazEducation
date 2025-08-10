import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SubscriptionTable({
  subscriptions,
  setSubscriptions,
  onRefresh,
}) {
  // Delete function inside the table
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?"))
      return;

    try {
      const res = await fetch(
        `https://niazeducationscholarshipsbackend-production.up.railway.app/api/subscriptions/${id}/`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setSubscriptions((prev) => prev.filter((s) => s.id !== id));
        if (onRefresh) onRefresh();
      } else {
        alert("Failed to delete subscription");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting subscription");
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Funding Plan
        </Typography>
      </Box>
      <Table
        sx={{
          "& th": {
            backgroundColor: "#f9fafb",
            fontWeight: 600,
            textAlign: "center",
          },
          "& td": { textAlign: "center" },
          "& td, & th": { borderBottom: "1px solid #e0e0e0" },
          "& tr:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Source</TableCell>
            <TableCell align="center">Committed Amount</TableCell>
            <TableCell align="center">Installment Amount</TableCell>
            <TableCell align="center">Frequency</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell align="center">{sub.source}</TableCell>
              <TableCell align="center">
                {sub.pledged_amount}{" "}
                <span style={{ fontSize: "0.75em" }}>PKR</span>
              </TableCell>
              <TableCell align="center">
                {sub.amount_per_period}{" "}
                <span style={{ fontSize: "0.75em" }}>PKR</span>
              </TableCell>
              <TableCell align="center">{sub.payment_frequency}</TableCell>
              <TableCell align="center">{sub.start_date}</TableCell>
              <TableCell align="center">
                <IconButton color="error" onClick={() => handleDelete(sub.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
