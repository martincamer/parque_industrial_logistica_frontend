import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler
);

const LineasGraficoDeRecaudaciones = ({ data }) => {
  // Extraer recaudaciones y fechas
  const recaudaciones = data.map((orden) => parseFloat(orden.recaudacion) || 0);
  const etiquetas = data.map((orden) => {
    // Obtener los datos de cliente y crear una cadena para cada uno
    const contratos = orden.datos_cliente.datosCliente
      .map(
        (clienteInfo) =>
          `${clienteInfo.cliente.toUpperCase()} (${clienteInfo.numeroContrato})`
      )
      .join(", "); // Unir múltiples contratos en una sola cadena

    return `${contratos} - ${new Date(
      orden.fecha_entrega
    ).toLocaleDateString()}`; // Formato de la etiqueta
  });

  // Definir los datos para el gráfico
  const chartData = {
    labels: etiquetas,
    datasets: [
      {
        label: "RECAUDACIONES Y PERDIDAS (ARS)",
        data: recaudaciones,
        fill: true,
        backgroundColor: recaudaciones.map((value) =>
          value < 0 ? "rgba(239, 68, 68, 0.3)" : "rgba(52, 211, 153, 0.3)"
        ), // Color de fondo: rojo para negativos, verde para positivos
        borderColor: recaudaciones.map((value) =>
          value < 0 ? "rgba(239, 68, 68, 1)" : "rgba(52, 211, 153, 1)"
        ), // Color de la línea: rojo para negativos, verde para positivos
        borderWidth: 2,
        pointBackgroundColor: recaudaciones.map((value) =>
          value < 0 ? "rgba(239, 68, 68, 1)" : "rgba(52, 211, 153, 1)"
        ), // Color de los puntos: rojo para negativos, verde para positivos
      },
    ],
  };

  // Opciones para el gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `ARS ${value.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "TOTALES EN PESOS (ARS)",
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default LineasGraficoDeRecaudaciones;
