import Chart from "react-apexcharts";

// Datos de ejemplo con dos series: remuneraciones y legales
const ApexChart = ({ legales, remuneraciones }) => {
  // Transformar los datos para el gráfico
  const prepareData = (data) => {
    return data.map((item) => ({
      created_at: new Date(item.created_at).toISOString().split("T")[0], // Obtenemos solo la fecha (YYYY-MM-DD)
      recaudacion: parseFloat(item.recaudacion), // Convertir a número
    }));
  };

  const remuneracionesData = prepareData(remuneraciones);

  const legalesData = prepareData(legales).map((item) => ({
    ...item,
    recaudacion: -item.recaudacion, // Hacer que sea negativo
  }));

  const series = [
    {
      name: "REMUNERACIONES CONTRATOS",
      data: remuneracionesData.map((d) => ({
        x: d.created_at,
        y: d.recaudacion,
      })),
    },
    {
      name: "LEGALES CONTRATOS",
      data: legalesData.map((d) => ({
        x: d.created_at,
        y: d.recaudacion,
      })),
    },
  ];

  const options = {
    chart: {
      type: "area",
      height: 500,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth", // Para hacer líneas tipo spline
    },
    xaxis: {
      type: "datetime", // Usamos fechas
      labels: {
        style: {
          fontWeight: "bold", // Etiquetas del eje X en negrita
        },
      },
    },
    yaxis: {
      title: {
        text: "Recaudación (ARS)", // Título para el eje Y
        fontWeight: "bold",
      },
    },
    labels: {
      style: {
        fontWeight: "bold", // Etiquetas del eje Y en negrita
      },
    },
    tooltip: {
      x: {
        format: "yyyy-MM-dd", // Formato de fecha
      },
      y: {
        formatter: (value) => {
          return `ARS ${value.toLocaleString()}`; // Formateamos para mostrar el símbolo y formato de moneda
        },
      },
    },
    fill: {
      type: "gradient", // Efecto de degradado en el área
      gradient: {
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    colors: ["#00E396", "#FF4560"], // Colores para las dos series
    legend: {
      position: "top", // Posición de la leyenda
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="area" height={400} />
    </div>
  );
};

export default ApexChart;
