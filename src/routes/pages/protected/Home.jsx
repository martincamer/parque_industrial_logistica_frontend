import { useEffect, useState } from "react";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { useSalidasContext } from "../../../context/SalidasProvider";
import ApexChart from "../../../components/apexchart/ApexChart";
import ApexColumnChart from "../../../components/apexchart/ApexChartColumn";
import { Link } from "react-router-dom";
import RemuneracionesProgressBar from "../../../components/charts/RemuneracionesProgressBar";
import SalidasProgressBar from "../../../components/charts/SalidasProgressBar";
import ViviendasProgressBar from "../../../components/charts/ViviendasProgressBar";

export const Home = () => {
  const { salidas } = useSalidasContext();
  const { remuneracionesMensuales, remuneraciones } = useRemuneracionContext();

  const { rendiciones } = useRendicionesContext();

  const { legales, legalesReal } = useLegalesContext();

  //fltros
  const [selectedUser, setSelectedUser] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(
      remuneraciones.map((remuneracion) => remuneracion.usuario.toLowerCase())
    )
  );

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // Estado inicial de las fechas con el rango del mes actual
  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  // Filtro por rango de fechas (si están definidas)
  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinObj = new Date(fechaFin);
  // Filtro por término de búsqueda y usuario seleccionado
  let filteredDataRemuneraciones = remuneraciones.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    return matchesUser;
  });

  filteredDataRemuneraciones = filteredDataRemuneraciones.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado
  let filteredDataLegales = legalesReal.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    return matchesUser;
  });

  filteredDataLegales = filteredDataLegales.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado
  let filteredDataRendiciones = rendiciones.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    return matchesUser;
  });

  filteredDataRendiciones = filteredDataRendiciones.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado
  let filteredDataSalidas = salidas.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    return matchesUser;
  });

  filteredDataSalidas = filteredDataSalidas.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  const totalCobroCliente = filteredDataRemuneraciones.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegales = filteredDataLegales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendiciones = filteredDataRendiciones.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const totalCobroClienteFinal = remuneraciones.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegalesFinal = legalesReal.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendicionesFinal = rendiciones.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const totalEnSalidas = filteredDataSalidas.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera),
    0
  );

  const totalContratosRemunerados = filteredDataRemuneraciones?.reduce(
    (total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente
          ? salida?.datos_cliente?.datosCliente?.length
          : 0)
      );
    },
    0
  );

  const totalContratosLegales = filteredDataLegales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadradosRemunerados =
    filteredDataRemuneraciones?.reduce((total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
          return subtotal + Number(cliente.metrosCuadrados);
        }, 0) || 0)
      );
    }, 0);

  const totalDatosMetrosCuadradosLegales = filteredDataLegales?.reduce(
    (total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
          return subtotal + Number(cliente.metrosCuadrados);
        }, 0) || 0)
      );
    },
    0
  );

  //contratos y metros
  const totalContratos =
    Number(totalContratosRemunerados) + Number(totalContratosLegales);

  const totalMetrosCuadrados =
    Number(totalDatosMetrosCuadradosRemunerados) +
    Number(totalDatosMetrosCuadradosLegales);

  const totalCaja = Number(
    Number(totalCobroClienteFinal + totalCobroClienteLegalesFinal) +
      Number(totalCobroRendicionesFinal)
  );

  const totalCajaFiltrada = Number(
    Number(totalCobroCliente + totalCobroClienteLegales) +
      Number(totalCobroRendiciones)
  );

  /////////////////////USUARIO DATOS///////////////
  const totalEnFletesGeneradosEnRemunercionesUsuario =
    filteredDataRemuneraciones?.reduce((total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente
          ? salida.datos_cliente.datosCliente.reduce(
              (subtotal, cliente) => subtotal + Number(cliente.totalFlete || 0), // Asegurarse de manejar el caso en que totalFlete no esté definido
              0
            )
          : 0)
      );
    }, 0);

  const totalEnViaticosGeneradosEnRemunercionesUsuario =
    filteredDataRemuneraciones?.reduce((total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    }, 0);

  const totalEnFletesGeneradosEnLegalesUsuario = filteredDataLegales?.reduce(
    (total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente
          ? salida.datos_cliente.datosCliente.reduce(
              (subtotal, cliente) => subtotal + Number(cliente.totalFlete || 0), // Asegurarse de manejar el caso en que totalFlete no esté definido
              0
            )
          : 0)
      );
    },
    0
  );

  const totalEnViaticosGeneradosEnLegalesUsuario = legales?.reduce(
    (total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    },
    0
  );

  const totalGeneradoEnRefuerzosUsuario = filteredDataRemuneraciones?.reduce(
    (total, salida) => {
      return total + Number(salida.refuerzo || 0); // Asegúrate de que salida.refuerzo es un número
    },
    0
  );

  const totalGeneradoEnRefuerzosLegalesUsuario = filteredDataLegales?.reduce(
    (total, salida) => {
      return total + Number(salida.refuerzo || 0); // Asegúrate de que salida.refuerzo es un número
    },
    0
  );

  const totalRefuerzos =
    totalGeneradoEnRefuerzosUsuario + totalGeneradoEnRefuerzosLegalesUsuario;

  const totalViaticos =
    totalEnViaticosGeneradosEnLegalesUsuario +
    totalEnViaticosGeneradosEnRemunercionesUsuario;

  const totalFletes =
    totalEnFletesGeneradosEnLegalesUsuario +
    totalEnFletesGeneradosEnRemunercionesUsuario;

  // Estado para almacenar la fecha actual
  const [fechaActual, setFechaActual] = useState("");

  // Función para obtener y formatear la fecha actual
  const obtenerFechaActual = () => {
    const fecha = new Date();
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const fechaFormateada = fecha.toLocaleDateString("es-AR", options);
    setFechaActual(fechaFormateada);
  };

  // Efecto para obtener la fecha actual al montar el componente
  useEffect(() => {
    obtenerFechaActual();
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white max-md:text-sm"
        >
          Inicio/estadisticas
        </Link>{" "}
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6 max-md:py-3 max-md:px-4 flex justify-between items-center">
        <p className="font-bold text-blue-500 text-xl max-md:text-base">
          Observa las estadisticas, filtra por mes, anualmente resultados, etc.
        </p>
        <p className="font-bold">Fecha actual {fechaActual}</p>
      </div>
      <div className="flex gap-2 items-center w-2/3 max-md:w-auto max-md:flex-col my-5 mx-5">
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer">
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="outline-none text-slate-600 bg-white w-full uppercase"
          >
            <option className="uppercase font-bold text-orange-400" value="">
              Seleccionar usuario...
            </option>
            {uniqueUsers.map((user) => (
              <option
                className="uppercase font-semibold"
                key={user}
                value={user}
              >
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
          <input
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            type="date"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Fecha de inicio"
          />
        </div>
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
          <input
            value={fechaFin}
            onChange={handleFechaFinChange}
            type="date"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Fecha fin"
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 mx-5 bg-white py-5 px-5 max-md:grid-cols-1 max-md:overflow-y-scroll max-md:h-[50vh] scrollbar-hidden">
        <div
          className={`border ${
            totalCaja < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total de la caja actual.</p>
              <p
                className={`${
                  totalCaja < 0 ? "text-red-500" : "text-green-500"
                } font-extrabold`}
              >
                {Number(totalCaja).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalCaja < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalCaja % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalCobroCliente < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en remuneraciones.</p>
              <p
                className={`${
                  totalCobroCliente < 0 ? "text-red-500" : "text-green-500"
                } font-extrabold`}
              >
                {Number(totalCobroCliente).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalCobroCliente < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalCobroCliente % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalCobroClienteLegales < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en legales.</p>
              <p
                className={`${
                  totalCobroClienteLegales < 0
                    ? "text-red-500"
                    : "text-green-500"
                } font-extrabold`}
              >
                {Number(totalCobroClienteLegales).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalCobroClienteLegales < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalCobroClienteLegales % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalCobroClienteLegales < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en rendiciones.</p>
              <p
                className={`${
                  totalCobroRendiciones < 0 ? "text-red-500" : "text-green-500"
                } font-extrabold`}
              >
                {Number(totalCobroRendiciones).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalCobroRendiciones < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalCobroRendiciones % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalEnSalidas < 0 ? "border-red-500" : "border-red-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en salidas.</p>
              <p
                className={`${
                  totalEnSalidas < 0 ? "text-red-500" : "text-red-500"
                } font-extrabold`}
              >
                -{" "}
                {Number(totalEnSalidas).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalEnSalidas < 0
                    ? "text-white bg-red-500"
                    : "bg-red-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalEnSalidas % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalViaticos < 0 ? "border-red-500" : "border-red-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en viaticos.</p>
              <p
                className={`${
                  totalViaticos < 0 ? "text-red-500" : "text-red-500"
                } font-extrabold`}
              >
                -{" "}
                {Number(totalViaticos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalViaticos < 0
                    ? "text-white bg-red-500"
                    : "bg-red-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalViaticos % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalFletes < 0 ? "border-red-500" : "border-red-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en fletes.</p>
              <p
                className={`${
                  totalFletes < 0 ? "text-red-500" : "text-red-500"
                } font-extrabold`}
              >
                -{" "}
                {Number(totalFletes).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalFletes < 0
                    ? "text-white bg-red-500"
                    : "bg-red-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalFletes % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalRefuerzos < 0 ? "border-red-500" : "border-red-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en refuerzos.</p>
              <p
                className={`${
                  totalRefuerzos < 0 ? "text-red-500" : "text-red-500"
                } font-extrabold`}
              >
                -{" "}
                {Number(totalRefuerzos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalRefuerzos < 0
                    ? "text-white bg-red-500"
                    : "bg-red-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalRefuerzos % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalContratos < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en viviendas/contratos.</p>
              <p
                className={`${
                  totalContratos < 0 ? "text-red-500" : "text-blue-500"
                } font-extrabold`}
              >
                {totalContratos}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalContratos < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalContratos % 100} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalMetrosCuadrados < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en metros cuadrados.</p>
              <p
                className={`${
                  totalMetrosCuadrados < 0 ? "text-red-500" : "text-blue-500"
                } font-extrabold`}
              >
                {totalMetrosCuadrados?.toFixed(2)} mts
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalMetrosCuadrados < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {Number(totalMetrosCuadrados % 100).toFixed(2)} %
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border ${
            totalCajaFiltrada < 0 ? "border-red-500" : "border-blue-500"
          } py-5 px-5 bg-white col-span-2 max-md:col-span-1`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between max-md:flex-col">
              <p className="font-bold">
                Total remuneraciónes/rendiciones - legales.
              </p>
              <p
                className={`${
                  totalCajaFiltrada < 0 ? "text-red-500" : "text-blue-500"
                } font-extrabold`}
              >
                {Number(totalCajaFiltrada).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="flex">
              <div
                className={`${
                  totalCajaFiltrada < 0
                    ? "text-white bg-red-500"
                    : "bg-blue-500 text-white"
                } rounded py-1.5 px-4  font-bold text-xs`}
              >
                Porcentaje {totalCajaFiltrada % 100} %
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 my-10">
        <div className="py-5 px-5 mb-5 text-white bg-blue-500">
          <p className="font-bold text-lg uppercase max-md:text-sm">
            Graficos del mes
          </p>
        </div>
        <div className="w-full grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <div className="bg-white py-5 px-5">
            <ApexChart
              remuneraciones={remuneracionesMensuales}
              legales={legales}
            />
          </div>
          <div className="bg-white py-5 px-5">
            <ApexColumnChart
              totalFletesUsuario={totalFletes}
              totalViaticosUsuario={totalViaticos}
              totalRefuerzosUsuario={totalRefuerzos}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1  px-2 mx-5 my-10">
        <div className="hidden md:hidden max-md:block font-semibold text-sm uppercase text-slate-600 underline">
          <p> Progreso de las entregas</p>
        </div>

        <div className="bg-white py-8 px-5 transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total de la caja
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm font-bold ${
                totalCaja >= 0 ? "text-blue-500" : "text-red-500"
              }`}
            >
              {Number(totalCaja).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalCaja >= 0 ? "bg-blue-500" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalCaja / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>

        <RemuneracionesProgressBar
          rendicionesMensuales={filteredDataRendiciones}
          remuneracionesMensuales={filteredDataRemuneraciones}
        />
        <SalidasProgressBar salidasMensuales={filteredDataSalidas} />
        <ViviendasProgressBar
          salidasMensuales={filteredDataRemuneraciones}
          legales={filteredDataLegales}
        />

        <div className="bg-white py-8 px-5 transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total en fletes
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
            >
              -{" "}
              {Number(totalFletes).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalFletes >= 0 ? "bg-red-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalFletes / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white py-8 px-5 transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total en viaticos
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
            >
              -{" "}
              {Number(totalViaticos).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalViaticos >= 0 ? "bg-red-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalViaticos / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white py-8 px-5 transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total en refuerzos
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
            >
              -{" "}
              {Number(totalRefuerzos).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalRefuerzos >= 0 ? "bg-red-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalRefuerzos / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
