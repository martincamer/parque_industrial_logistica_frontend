import React from "react";
import Chart from "react-apexcharts";

const RemuneracionesDonutChart = ({ remuneraciones }) => {
  // Calculating total recaudacion
  const totalRecaudacion = remuneraciones.reduce(
    (acc, remuneracion) => acc + parseFloat(remuneracion.recaudacion),
    0
  );

  // Configuring chart options
  const options = {
    chart: {
      type: "donut",
      height: 300,
    },
    labels: remuneraciones.map(
      (remuneracion) => remuneracion.created_at.split("T")[0]
    ), // Using dates as labels
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "80%", // Adjust inner radius to create the donut shape
          labels: {
            show: true,
            total: {
              show: true,
              label: "TOTAL",
              formatter: function () {
                return totalRecaudacion.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                }); // Display total recaudacion
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
      show: true,
    },
  };

  // Configuring chart series
  const series = remuneraciones.map((remuneracion) =>
    parseFloat(remuneracion.recaudacion)
  );

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="donut"
        width={"100%"} // Adjust chart width as needed
        height={300} // Adjust chart height as needed
      />
    </div>
  );
};

export default RemuneracionesDonutChart;
