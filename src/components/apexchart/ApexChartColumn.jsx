import Chart from "react-apexcharts";

const ApexColumnChart = ({
  totalFletesUsuario,
  totalViaticosUsuario,
  totalRefuerzosUsuario,
}) => {
  // Definir las series y las categorías para el gráfico de columnas
  const series = [
    {
      name: "Total",
      data: [totalFletesUsuario, totalViaticosUsuario, totalRefuerzosUsuario],
    },
  ];

  // Nombres de las categorías para el eje X
  const categories = ["Fletes", "Viáticos", "Refuerzos"];

  // Opciones para el gráfico de columnas
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false, // Columnas verticales
        columnWidth: "50%", // Ancho relativo de las columnas
      },
    },
    dataLabels: {
      enabled: true, // Mostrar etiquetas de datos
      style: {
        colors: ["#fff"], // Color de las etiquetas
      },
      formatter: (value) => {
        return `ARS ${value.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumIntegerDigits: 2,
        })}`; // Formato de moneda
      },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: "Recaudación (ARS)", // Título del eje Y
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return `ARS ${value.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumIntegerDigits: 2,
          })}`; // Formato en el tooltip
        },
      },
    },
    colors: ["#ef4444"], // Color de las columnas
    title: {
      text: "Totales de gastos en fletes, viáticos, refuerzos.",
      align: "center", // Título del gráfico
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ApexColumnChart;
