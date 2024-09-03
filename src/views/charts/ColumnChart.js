import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";

const ColumnChart = () => {
  const optionscolumnchart = {
    chart: {
      id: "column-chart",
      fontFamily: "'Inter', sans-serif",
      foreColor: "#adb0bb",
    },

    series: [
      {
        name: "Values",
        data: [15, 40, 20, 35],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        fontFamily: "'Inter', sans-serif",
        foreColor: "#adb0bb",
        toolbar: {
          show: false,
        },
      },

      tooltip: {
        enabled: false, // Hide tooltips
      },

      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 5,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },

      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      xaxis: {
        categories: ["Dreamz", "Nemesis", "Danger", "Slegfried"],
        labels: {
          style: {
            colors: "#fff",
            fontSize: "0.875rem",
            fontWeight: 600,
            fontFamily: "Inter",
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: "#fff",
            fontWeight: 500,
            fontSize: "0.875rem",
            fontFamily: "Inter",
          },
        },
      },

      grid: {
        xaxis: {
          lines: {
            show: false, // Hide x-axis grid lines
          },
        },
        yaxis: {
          lines: {
            show: false, // Hide y-axis grid lines
          },
        },
      },

      colors: ["#CB9544", "#A99FB8", "#827299", "#D6BBFB"],
    },
  };

  return (
    <PageContainer title="Column Chart" description="this is innerpage">
      <ParentCard>
        <Chart
          options={optionscolumnchart.options}
          series={optionscolumnchart.series}
          type="bar"
          height="250px"
          className="chart-123"
        />
      </ParentCard>
    </PageContainer>
  );
};

export default ColumnChart;
