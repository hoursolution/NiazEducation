import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import logo from "../../assets/NAIZ_LOGO.png";
import dashboard from "../../assets/Dashboard.png";
import application from "../../assets/application.png";
import mentor from "../../assets/mentor.png";
import projectionsheet from "../../assets/projectionSheet.png";
import student from "../../assets/students.png";
import donor from "../../assets/donor.png";
import verification from "../../assets/Verificatiion.png";
import interview from "../../assets/interview.png";
import logout from "../../assets/logout2.png";
import { useNavigate } from "react-router-dom";

export function SidebarOne({
  isOpen,
  onClose,
  handleMenuItemClick,
  selectedMenuItem,
}) {
  const navigate = useNavigate();

  const sidebarBg = "#209be3";
  const hoverBg = "rgba(0, 0, 0, 0.20)";
  const activeBg = "rgba(0, 0, 0, 0.40)";
  const textColor = "white";

  const drawerWidthOpen = 198;
  const drawerWidthClosed = 60;

  const drawerPaperStyle = {
    background: sidebarBg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: textColor,
    borderRight: "none",
    width: 198,
    boxShadow: "4px 0 6px rgba(0, 0, 0, 0.1)",
    width: isOpen ? drawerWidthOpen : drawerWidthClosed,
    height: "100vh", // Explicitly set to viewport height
    overflowX: "hidden",
    overflowY: "hidden", // Disable vertical scrolling
    transition: "width 0.3s ease",
    boxSizing: "border-box",
  };

  const menuItems = [
    { text: "Dashboard", icon: dashboard, path: "/admin", action: "DASHBOARD" },
    {
      text: "Application",
      icon: application,
      path: "allApplications",
      action: "APPLICATION",
    },
    {
      text: "Verification",
      icon: verification,
      path: "allVarification",
      action: "VERIFICATION",
    },
    {
      text: "Interviews",
      icon: interview,
      path: "allInterviews",
      action: "INTERVIEW",
    },
    {
      text: "Manage Donor",
      icon: mentor,
      path: "donors",
      action: "MANAGE DONOR",
    },
    {
      text: "Select Donor",
      icon: donor,
      path: "selectDonor",
      action: "SELECT DONOR",
    },
    {
      text: "Projection Sheets",
      icon: projectionsheet,
      path: "ProjectionDashBoard1",
      action: "PROJECTION SHEETS",
    },
    { text: "Students", icon: student, path: "Students", action: "STUDENTS" },
  ];

  const handleItemClick = (item) => {
    handleMenuItemClick(item.action);
    navigate(item.path);
  };

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      onClose={onClose}
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": drawerPaperStyle,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        {isOpen && (
          <motion.div
            className="flex justify-center py-2 bg-white mx-2 my-2 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={logo}
              alt="NAIZ Logo"
              className="h-20 object-contain cursor-pointer" // Reduced logo height
              onClick={() => navigate("/admin")}
            />
          </motion.div>
        )}

        {/* Menu Items */}
        <List className="flex-grow px-2" sx={{ overflow: "hidden" }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: "12px",
                mb: 0.5, // Reduced margin
                px: isOpen ? 2.5 : 1.5,
                py: 0.5, // Reduced padding
                backgroundColor:
                  selectedMenuItem === item.action ? activeBg : "transparent",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: hoverBg,
                },
                justifyContent: isOpen ? "flex-start" : "center",
              }}
            >
              <ListItemIcon sx={{ minWidth: isOpen ? "36px" : "0" }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={item.icon}
                    alt={item.text}
                    className={isOpen ? "w-4" : "w-6"}
                    style={{
                      filter:
                        selectedMenuItem === item.action
                          ? "brightness(0) invert(1)"
                          : "none",
                      opacity: selectedMenuItem === item.action ? 1 : 0.8,
                    }}
                  />
                </motion.div>
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "12px",
                      fontWeight: "500",
                      color: textColor,
                      letterSpacing: "0.2px",
                    },
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        {/* Logout */}
        <motion.div
          className="px-2 pb-2" // Reduced bottom padding
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Divider
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              marginBottom: "8px", // Reduced margin
            }}
          />
          <ListItem
            button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            sx={{
              borderRadius: "6px",
              px: isOpen ? 2.5 : 1.5,
              py: 0.5, // Reduced padding
              justifyContent: isOpen ? "flex-start" : "center",
              "&:hover": {
                backgroundColor: hoverBg,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: isOpen ? "36px" : "0" }}>
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={logout}
                  alt="logout"
                  className={isOpen ? "w-3" : "w-5"}
                />
              </motion.div>
            </ListItemIcon>
            {isOpen && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: {
                    fontSize: "14px",
                    fontWeight: "600",
                    color: textColor,
                  },
                }}
              />
            )}
          </ListItem>
        </motion.div>
      </div>
    </Drawer>
  );
}
