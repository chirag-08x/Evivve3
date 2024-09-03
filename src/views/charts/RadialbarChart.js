import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import PageContainer from "../../components/container/PageContainer";
import ParentCard from "../../components/shared/ParentCard";
import SafeSocketProvider from "src/services/safeSocketProvider";

const RadialbarChart = () => {
  const [daysLeftCount, setDaysLeftCount] = useState(365);

  useEffect(() => {
    SafeSocketProvider.on("redis-data", (data) => {
      setDaysLeftCount(data.daysLeftCount);
      // console.log(((365 - data.daysLeftCount) / 365) * 360);
      setOptionsRadial((prevOptions) => ({
        ...prevOptions,
        plotOptions: {
          ...prevOptions.plotOptions,
          radialBar: {
            ...prevOptions.plotOptions.radialBar,
            endAngle: (data.daysLeftCount / 365) * 360,
          },
        },
      }));
    });
  }, []);

  const getInitialOptions = {
    // series: [0],
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        track: {
          background: "#341A5A",
          strokeWidth: "75%",
          margin: 0,
        },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: 20,
            align: "center",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
          },
          value: {
            offsetY: -14,
            align: "center",
            formatter: function (val) {
              return val;
            },
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 600,
          },
        },
      },
    },
    fill: {
      colors: ["#341A5A"],
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.1,

        // HIDES TOP RADIAL BAR
        opacityFrom: 0,
        opacityTo: 0,

        gradientToColors: undefined,
        inverseColors: false,
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Days"],
  };

  const [optionsRadial, setOptionsRadial] = useState(getInitialOptions);

  // useEffect(() => {
  //   setOptionsRadial((prevOptions) => ({
  //     ...prevOptions,
  //     plotOptions: {
  //       ...prevOptions.plotOptions,
  //       radialBar: {
  //         ...prevOptions.plotOptions.radialBar,
  //         endAngle: (daysLeftCount / 365) * 360,
  //         startAngle: 0,
  //       },
  //     },
  //   }));
  // }, [daysLeftCount]);

  const seriesRadial = [daysLeftCount];

  //   const radialBarChartData = {
  //     series: [100],
  //     chartOptions: {
  //       chart: {
  //         height: 350,
  //         type: 'radialBar',
  //       },
  //       plotOptions: {
  //         radialBar: {
  //           startAngle: 0,
  //           endAngle: 360,
  //         },
  //       },
  //       track: {
  //         show: true,
  //         startAngle: undefined,
  //         endAngle: 55,
  //         background: '#f2f2f2',
  //         strokeWidth: '97%',
  //         opacity: 1,
  //         margin: 5,
  //         dropShadow: {
  //           enabled: false,
  //           top: 0,
  //           left: 0,
  //           blur: 3,
  //           opacity: 0.5
  //         }
  //       },
  //       dataLabels: {
  //         showOn: "always",
  //         name: {
  //           show: true,
  //           color: "#BDBDBD",
  //           fontSize: "14px",
  //         },
  //         color: "#BDBDBD",
  //         fontSize: "30px",
  //         show: true,
  //       },
  //       labels: ['Days'],
  //     },
  //   };
  //
  //   const socket = getSocket();
  //   let [progress, setProgress] = useState([100]);
  //
  //   useEffect(() =>
  //   {
  //     socket.on("redis-data", (data) =>
  //     {
  //       var percentage = Math.round((data.daysLeftCount / 365) * 100);
  //       setProgress([percentage]);
  //     });
  //   });
  //
  //   const seriesRadial = progress;
  //
  return (
    <PageContainer description="this is innerpage">
      <ParentCard>
        <Chart
          options={optionsRadial}
          series={seriesRadial}
          type="radialBar"
          height="250px"
          width="250px"
        />
      </ParentCard>
    </PageContainer>
  );
};

export default RadialbarChart;
