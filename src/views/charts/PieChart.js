import React from "react";
import Chart from "react-apexcharts";
import { Grid } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";

const PieChart = () => {
  const chartOptions = {
    labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
    dataLabels: {
      enabled: true,
    },

    chart: {
      padding: 0, // Remove padding
    },

    legend: {
      show: false,
    },

    tooltip: {
      enabled: false, // Hide tooltips
    },

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
        },
      },
    },

    colors: ["#CB9544", "#A99FB8", "#827299", "#D6BBFB"],
  };

  const chartSeries = [41, 29, 15, 15];

  return (
    <PageContainer title="Doughnut & Pie Chart" description="this is innerpage">
      <ParentCard>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="pie"
          width="250px"
          height="250px"
        />
      </ParentCard>
    </PageContainer>
  );
};

export default PieChart;
