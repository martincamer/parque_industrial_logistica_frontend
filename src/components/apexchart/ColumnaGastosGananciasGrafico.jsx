import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ColumnaGastosGananciasGrafico = ({ data }) => {
  // Calcular los totales para fletes, viáticos, refuerzos y vehículo
  const totalFletesUsuario = data.reduce((total, orden) => {
    const fleteTotal = orden.datos_cliente.datosCliente.reduce(
      (acc, cliente) => acc + (parseFloat(cliente.totalFlete) || 0),
      0
    );
    return total + fleteTotal;
  }, 0);

  const totalViaticosUsuario = data.reduce(
    (total, orden) => total + parseFloat(orden.viaticos || 0),
    0
  );

  const totalRefuerzosUsuario = data.reduce(
    (total, orden) => total + parseFloat(orden.refuerzo || 0),
    0
  );

  const totalAutoUsuario = data.reduce(
    (total, orden) => total + parseFloat(orden.auto || 0),
    0
  );

  // Definir los datos para el gráfico
  const chartData = {
    labels: ["FLETES", "VIÁTICOS", "REFUERZOS", "VEHÍCULO"],
    datasets: [
      {
        label: "Total (ARS)",
        data: [
          totalFletesUsuario,
          totalViaticosUsuario,
          totalRefuerzosUsuario,
          totalAutoUsuario,
        ],
        backgroundColor: [
          "rgba(52, 211, 153, 0.8)", // Verde para Fletes
          "rgba(239, 68, 68, 0.8)", // Rojo para Viáticos
          "rgba(239, 68, 68, 0.8)", // Rojo para Refuerzos
          "rgba(239, 68, 68, 0.8)", // Rojo para Vehículo
        ],
        borderColor: [
          "rgba(52, 211, 153, 1)", // Borde verde para Fletes
          "rgba(239, 68, 68, 1)", // Borde rojo para Viáticos
          "rgba(239, 68, 68, 1)", // Borde rojo para Refuerzos
          "rgba(239, 68, 68, 1)", // Borde rojo para Vehículo
        ],
        borderWidth: 1,
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };

  // Opciones para el gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ocultar la leyenda si no es necesaria
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

  return <Bar data={chartData} options={chartOptions} />;
};

export default ColumnaGastosGananciasGrafico;
