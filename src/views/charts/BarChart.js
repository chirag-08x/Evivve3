import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import SafeSocketProvider from "src/services/safeSocketProvider";

const BarChart = () => {

  const tribeName = localStorage.getItem("tribe_name");

  const chartData = {
    options : {
      dataLabels: {
        position: "center",
        formatter: function (val, opts)
        {
          return val + "%";
        },
        style: {
          colors: ["#C1760C"],
          // align: "center",
          // fontSize: 'auto',
          fontSize: '24px',
          fontWeight: 'bold',
        },
      },
      chart: {
        type: 'bar',
        height: "100%",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadiusApplication: "end",
          borderRadius: 8,
                columnWidth: "60%",
                columnHeight: "50%",
        }
      },
      colors: ["#CB9544"],
      grid: {
        yaxis: {
          lines: {
            show: false, // Hide x-axis grid lines
          },
        }
      },
      yaxis:
          {
            max : 100,
          },
    },
  };

  let [progress, setProgress] = useState([{
    data: [{
      x: tribeName,
      y: 0,
    }]
  }]);

  useEffect(() => {
    SafeSocketProvider.on("redis-data", (data) => {
      setProgress([{
        data: [{
          x: tribeName,
          y: data.genome,
          // y: 50,
        }]
      }])
      // chartData.series.data= [{
      //   x: 'category A',
      //   // y: data.tribeValueCount,
      //   y: 50,
      // }];

      // setProgress((series) => ({
      //   ...series.data,
      //     data : [{
      //         x: 'category A',
      //         y: 50,
      //       }],
      //   }),);

      // setProgress([{
      //   x: 'category A',
      //   // y: data.tribeValueCount,
      //   y: 50,
      // }]);
    });
  }, []);


  const series = progress;

  return (
    <div>
      <Chart options={chartData.options} series={series}
             type="bar"
             height="100%"/>
    </div>
  );
};

export default BarChart;
