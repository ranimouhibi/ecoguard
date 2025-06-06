import React from "react";
import EmployeeDashboard from "../components/EmployeeDashboard"; // ton vrai dashboard
import RealTimeCharts from "../components/RealTimeCharts";


const EmployeeDashboardPage = () => {
  return (
    <>
      <EmployeeDashboard />
      <RealTimeCharts />
    </>
  );
};

export default EmployeeDashboardPage;
