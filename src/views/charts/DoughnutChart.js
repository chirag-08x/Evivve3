import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";

const DoughnutChart = () => {
  // chart color
  const theme = useTheme();
  const primary = "#D92D20";
  const secondary = "#fff";

  const optionsdoughnutchart = {
    chart: {
      id: "donut-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      background: "transparent",
    },

    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "48px",
              fontFamily: "Inter",
              fontWeight: 600,
              color: "#fff",
              offsetY: 16,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Days",
              showAlways: true,
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 500,
              color: "#F5F5F5",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return 100 - b;
                }, 0);
              },
            },
          },
        },
      },
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
      position: "bottom",
      width: "50px",
    },

    tooltip: {
      enabled: false, // Hide tooltips
    },

    colors: [primary, secondary],
    tooltip: {
      theme: "dark",
      fillSeriesColor: true,
    },
  };
  const seriesdoughnutchart = [75, 25];

  return (
    <PageContainer title="Doughnut & Pie Chart" description="this is innerpage">
      <ParentCard>
        <Chart
          options={optionsdoughnutchart}
          series={seriesdoughnutchart}
          type="donut"
          width="250px"
          height="250px"
        />
      </ParentCard>
    </PageContainer>
  );
};

export default DoughnutChart;
