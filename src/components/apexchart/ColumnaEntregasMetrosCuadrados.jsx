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

const ColumnaEntregasMetrosCuadrados = ({ data, salidas }) => {
  console.log(salidas);

  const totalContratosEntregados = data.reduce((total, orden) => {
    return total + (orden.datos_cliente.datosCliente.length > 0 ? 1 : 0); // Contar contratos entregados
  }, 0);

  const totalContratosEntregadosCargados = salidas.reduce((total, orden) => {
    return total + (orden.datos_cliente.datosCliente.length > 0 ? 1 : 0); // Contar contratos entregados
  }, 0);

  const totalMetrosCuadradosCargados = salidas.reduce((total, orden) => {
    return (
      total +
      orden.datos_cliente.datosCliente.reduce(
        (acc, cliente) => acc + (parseFloat(cliente.metrosCuadrados) || 0),
        0
      )
    );
  }, 0);

  const totalMetrosCuadrados = data.reduce((total, orden) => {
    return (
      total +
      orden.datos_cliente.datosCliente.reduce(
        (acc, cliente) => acc + (parseFloat(cliente.metrosCuadrados) || 0),
        0
      )
    );
  }, 0);

  // Definir los datos para el gráfico
  const chartData = {
    labels: [
      "CONTRATOS ENTREGADOS",
      "CONTRATOS CARGADOS",
      "METROS ENTREGADOS",
      "METROS CARGADOS",
    ],
    datasets: [
      {
        label: "",
        data: [
          totalContratosEntregados,
          totalContratosEntregadosCargados,
          totalMetrosCuadrados,
          totalMetrosCuadradosCargados,
        ],
        backgroundColor: [
          "rgba(52, 211, 153, 0.8)", // Verde para Contratos Entregados
          "rgba(52, 211, 153, 0.8)", // Verde para Contratos Entregados
          "rgba(37, 99, 235, 0.8)", // Azul para Metros Cuadrados}
          "rgba(37, 99, 235, 0.8)", // Azul para Metros Cuadrados
        ],
        borderColor: [
          "rgba(52, 211, 153, 1)", // Borde verde para Contratos Entregados
          "rgba(52, 211, 153, 1)", // Borde verde para Contratos Entregados
          "rgba(37, 99, 235, 1)", // Borde azul para Metros Cuadrados
          "rgba(37, 99, 235, 1)", // Borde azul para Metros Cuadrados
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
            return `${value} ${context.dataset.label}`; // Personalizar la etiqueta
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "TOTAL ENTREGAS Y METROS CUADRADOS",
        },
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default ColumnaEntregasMetrosCuadrados;
