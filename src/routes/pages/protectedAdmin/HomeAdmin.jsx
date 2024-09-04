import { useEffect, useState } from "react";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { useAuth } from "../../../context/AuthProvider";
import ApexColumnChart from "../../../components/apexchart/ApexChartColumn";
import ApexChartColumnLegalesRemuneraciones from "../../../components/apexchart/ApexChartColumnLegalesRemuneraciones";
import client from "../../../api/axios";

export const HomeAdmin = () => {
  const [salidas, setSalidas] = useState([]);
  const [remuneraciones, setRemuneraciones] = useState([]);
  const [rendiciones, setRendiciones] = useState([]);
  const [legales, setLegales] = useState([]);

  useEffect(() => {
    async function loadDataSalidas() {
      const respuesta = await client.get("/salidas-admin");
      setSalidas(respuesta.data);
    }

    loadDataSalidas();

    async function loadDataRemuneraciones() {
      const respuesta = await client.get("/remuneraciones-admin");
      setRemuneraciones(respuesta.data);
    }

    loadDataRemuneraciones();

    async function loadDataLegales() {
      const respuesta = await client.get("/legales-admin");
      setLegales(respuesta.data);
    }

    loadDataLegales();

    async function loadDataRendiciones() {
      const respuesta = await client.get("/rendiciones-admin");
      setRendiciones(respuesta.data);
    }

    loadDataRendiciones();
  }, []);

  const [selectedUser, setSelectedUser] = useState("");

  // Obtener lista de usuarios únicos filtrando por localidad del usuario
  const uniqueUsers = Array.from(
    new Set(
      salidas
        .filter((remuneracion) => remuneracion.localidad)
        .map((remuneracion) => remuneracion.localidad.toLowerCase())
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

  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];

  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // Estado inicial de las fechas con el rango del mes actual
  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);

  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  // Filtro por rango de fechas (si están definidas)
  const fechaInicioObj = new Date(fechaInicio);

  const fechaFinObj = new Date(fechaFin);

  // Filtro por término de búsqueda y usuario seleccionado en remuneraciones
  let filteredDataRemuneraciones = remuneraciones.filter((item) => {
    const matchesUser = item.localidad.toLowerCase();

    return matchesUser;
  });

  filteredDataRemuneraciones = filteredDataRemuneraciones.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado en legalesReal
  let filteredDataLegales = legales.filter((item) => {
    const matchesUser = item.localidad.toLowerCase();

    return matchesUser;
  });

  filteredDataLegales = filteredDataLegales.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado en rendiciones
  let filteredDataRendiciones = rendiciones.filter((item) => {
    const matchesUser = item.localidad.toLowerCase();

    return matchesUser;
  });

  filteredDataRendiciones = filteredDataRendiciones.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado en salidas
  let filteredDataSalidas = salidas.filter((item) => {
    const matchesUser = item.localidad.toLowerCase();

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

  // Total de cobro para remuneraciones por localidad del usuario actual
  const totalCobroClienteFinal = remuneraciones.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  // Total de cobro para legalesReal por localidad del usuario actual
  const totalCobroClienteLegalesFinal = legales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  // Total de cobro para rendiciones por localidad del usuario actual
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

  const totalContratosEnSalidas = filteredDataSalidas?.reduce(
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
  }, []);

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      <div className=" bg-gray-100 py-10 px-6 max-md:py-10 max-md:px-4 flex justify-between items-center">
        <p className="font-bold text-gray-800 text-xl max-md:text-base">
          Observa las estadisticas de la zona logistica, fletes, caja, etc.
        </p>
        <p className="font-bold max-md:hidden">Fecha actual {fechaActual}</p>
      </div>
      <div className="flex gap-2 items-center max-md:w-auto max-md:flex-col my-5 mx-10 max-md:items-start max-md:mx-5">
        <select
          value={selectedUser}
          onChange={handleUserChange}
          className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
        >
          <option className="capitalize font-bold text-primary" value="">
            Seleccionar usuario...
          </option>
          {uniqueUsers.map((localidad) => (
            <option
              className="capitalize font-semibold"
              key={localidad}
              value={localidad}
            >
              {localidad}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
            <input
              value={fechaInicio}
              onChange={handleFechaInicioChange}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha de inicio"
            />
          </div>
          <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
            <input
              value={fechaFin}
              onChange={handleFechaFinChange}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha fin"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 mx-5 bg-white py-5 px-5 max-md:grid-cols-1 max-md:overflow-y-scroll max-md:h-[50vh] scrollbar-hidden max-md:mx-0">
        <div
          className={`border ${
            totalCaja < 0 ? "border-red-500" : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total ganancias en la caja.</p>
              <p
                className={`${
                  totalCaja <= 0 ? "text-red-500" : "text-green-500"
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
                  totalCaja <= 0
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
            totalCobroCliente <= 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en ganancias remuneradas.</p>
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
            totalCobroClienteLegales <= 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">
                Total en perdidas por contratos legales.
              </p>
              <p
                className={`${
                  totalCobroClienteLegales <= 0
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
            totalCobroRendiciones <= 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en rendiciones.</p>
              <p
                className={`${
                  totalCobroRendiciones <= 0 ? "text-red-500" : "text-green-500"
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
                  totalCobroRendiciones <= 0
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
            totalEnSalidas <= 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
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
            totalViaticos < 0
              ? "border-red-500 rounded-md"
              : "border-red-500 rounded-md"
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
            totalFletes < 0
              ? "border-red-500 rounded-md"
              : "border-red-500 rounded-md"
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
            totalRefuerzos < 0
              ? "border-red-500 rounded-md"
              : "border-red-500 rounded-md"
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
            totalContratos < 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Contratos finalizados, entregados.</p>
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
        </div>{" "}
        <div
          className={`border ${
            totalContratosEnSalidas < 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Contratos de salidas por entregar.</p>
              <p
                className={`${
                  totalContratosEnSalidas < 0 ? "text-red-500" : "text-blue-500"
                } font-extrabold`}
              >
                {totalContratosEnSalidas}
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
            totalMetrosCuadrados < 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold">Total en metros cuadrados entregados.</p>
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
            totalCajaFiltrada < 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white col-span-2 max-md:col-span-1`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between max-md:flex-col">
              <p className="font-bold">
                Total en ganancia final, rendiciones + remuneraciones - legales.
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

      <div className="mx-5 my-10 bg-gray-800 px-10 py-10 rounded-md max-md:px-4 max-md:py-4 ">
        <div className="py-5 px-5 mb-5 text-white bg-primary rounded-md">
          <p className="font-bold text-lg uppercase max-md:text-sm">
            Graficos del mes
          </p>
        </div>
        <div className="w-full grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <div className="rounded-md py-5 px-5 bg-white">
            <ApexChartColumnLegalesRemuneraciones
              totalSalidas={totalEnSalidas}
              totalLegales={totalCobroRendiciones}
              totaslRemuneraciones={totalCobroCliente}
            />
          </div>
          <div className="bg-white py-5 px-5 rounded-md">
            <ApexColumnChart
              totalFletesUsuario={totalFletes}
              totalViaticosUsuario={totalViaticos}
              totalRefuerzosUsuario={totalRefuerzos}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
