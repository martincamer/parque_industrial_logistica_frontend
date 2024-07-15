import Chart from "react-apexcharts";

const ApexChartColumnLegalesRemuneraciones = ({
  totalSalidas,
  totaslRemuneraciones,
  totalLegales,
}) => {
  // Definir las series y las categorías para el gráfico de columnas
  const series = [
    {
      name: "Total",
      data: [totalSalidas, totaslRemuneraciones, totalLegales],
    },
  ];

  // Nombres de las categorías para el eje X
  const categories = [" - Salidas", "+ Remuneraciones", "- Legales"];

  // Definir colores para las columnas
  const colors = categories.map((categoria) => {
    if (categoria === "Salidas") return "#3b82f6"; // Rojo para Salidas
    else if (categoria === "Remuneraciones")
      return "#3b82f6"; // Azul para Remuneraciones
    else if (categoria === "Legales") return "#3b82f6"; // Rojo para Legales
    else return "#3b82f6"; // Azul para cualquier otra categoría
  });

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
    colors, // Aplicar los colores definidos
    title: {
      text: "Grafico de totales en salidas, contratos remunerados, contratos legales.",
      align: "center", // Título del gráfico
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ApexChartColumnLegalesRemuneraciones;
