import { useEffect, useState } from "react";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { useAuth } from "../../../context/AuthProvider";
import ColumnaGastosGananciasGrafico from "../../../components/apexchart/ColumnaGastosGananciasGrafico";
import LineasGraficoDeRecaudaciones from "../../../components/apexchart/LineasGraficoDeRecaudaciones";
import ColumnaEntregasMetrosCuadrados from "../../../components/apexchart/ColumnaEntregasMetrosCuadrados";

export const Home = () => {
  const { salidas } = useSalidasContext();

  const { remuneraciones, caja } = useRemuneracionContext();

  const { rendiciones } = useRendicionesContext();

  const { legales, legalesReal } = useLegalesContext();

  const [selectedUser, setSelectedUser] = useState("");

  const { user } = useAuth();

  // Obtener lista de usuarios únicos filtrando por localidad del usuario
  const uniqueUsers = Array.from(
    new Set(
      salidas
        .filter((remuneracion) => remuneracion.localidad === user.localidad)
        .map((remuneracion) => remuneracion.usuario.toLowerCase())
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
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    const matchesLocalidad = user.localidad === item.localidad;

    return matchesUser && matchesLocalidad;
  });

  filteredDataRemuneraciones = filteredDataRemuneraciones.filter((item) => {
    const fechaOrden = new Date(item.fecha_entrega);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado en legalesReal
  let filteredDataLegales = legalesReal.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    const matchesLocalidad = user.localidad === item.localidad;

    return matchesUser && matchesLocalidad;
  });

  filteredDataLegales = filteredDataLegales.filter((item) => {
    const fechaOrden = new Date(item.fecha_entrega);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado en rendiciones
  let filteredDataRendiciones = rendiciones.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    const matchesLocalidad = user.localidad === item.localidad;

    return matchesUser && matchesLocalidad;
  });

  filteredDataRendiciones = filteredDataRendiciones.filter((item) => {
    const fechaOrden = new Date(item.fecha_entrega);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtro por término de búsqueda y usuario seleccionado en salidas
  let filteredDataSalidas = salidas.filter((item) => {
    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

    const matchesLocalidad = user.localidad === item.localidad;

    return matchesUser && matchesLocalidad;
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
  const totalCobroClienteFinal = remuneraciones
    .filter((item) => user.localidad === item.localidad)
    .reduce((total, item) => total + parseFloat(item.recaudacion), 0);

  // Total de cobro para legalesReal por localidad del usuario actual
  const totalCobroClienteLegalesFinal = legalesReal
    .filter((item) => user.localidad === item.localidad)
    .reduce((total, item) => total + parseFloat(item.recaudacion), 0);

  // Total de cobro para rendiciones por localidad del usuario actual
  const totalCobroRendicionesFinal = rendiciones
    .filter((item) => user.localidad === item.localidad)
    .reduce((total, item) => total + parseFloat(item.rendicion_final), 0);

  const totalEnSalidas = filteredDataSalidas.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera) +
      parseFloat(item.gastos || 0),
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

  const totalDatosMetrosCudradosSalidas = filteredDataSalidas?.reduce(
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

  const totalEnVehiculoRemuneraciones = filteredDataRemuneraciones?.reduce(
    (total, salida) => {
      return total + (salida?.auto ? Number(salida.auto) : 0);
    },
    0
  );
  const totalEnVehiculoLegales = filteredDataLegales?.reduce(
    (total, salida) => {
      return total + (salida?.auto ? Number(salida.auto) : 0);
    },
    0
  );

  const totalFleteroRemuneraciones = filteredDataRemuneraciones?.reduce(
    (total, salida) => {
      return (
        total +
        (salida?.pago_fletero_espera ? Number(salida.pago_fletero_espera) : 0)
      );
    },
    0
  );
  const totalFleteroLegales = filteredDataLegales?.reduce((total, salida) => {
    return (
      total +
      (salida?.pago_fletero_espera ? Number(salida.pago_fletero_espera) : 0)
    );
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

  // Filter caja based on user's localidad
  const filteredCajas = caja.filter(
    (item) => item.localidad === user.localidad
  );

  // Calculate the total
  const totalCajaFinal = filteredCajas.reduce(
    (total, item) => total + parseFloat(item.total),
    0
  );

  let combinedData = [...remuneraciones, ...legalesReal];

  combinedData = combinedData.filter((item) => {
    const fechaOrden = new Date(item.fecha_entrega);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  console.log(combinedData);

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent ">
          Panel de control logistica.
        </p>
        <p className="font-bold max-md:hidden bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Fecha actual {fechaActual}
        </p>
      </div>
      <div className="flex gap-2 items-center max-md:w-auto max-md:flex-col my-0 max-md:pb-5 pt-12 mx-10 max-md:items-start max-md:mx-5 max-md:pt-5">
        <select
          value={selectedUser}
          onChange={handleUserChange}
          className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
        >
          <option className="capitalize font-bold text-primary" value="">
            Seleccionar usuario...
          </option>
          {uniqueUsers.map((user) => (
            <option
              className="capitalize font-semibold"
              key={user}
              value={user}
            >
              {user}
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
      <div className="grid grid-cols-5 gap-3 mx-5 bg-white py-5 px-5 max-md:grid-cols-1 max-md:overflow-y-scroll max-md:mx-0 max-md:py-0 max-md:pb-10">
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-600">
                Caja logistica.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalCajaFinal < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-green-400 to-green-50"
                }`}
              >
                {Number(totalCajaFinal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-600">
                Contratos remunerados entregados.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalCobroCliente < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-green-400 to-green-50"
                }`}
              >
                {Number(totalCobroCliente).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-600">
                Contratos legales entregados.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalCobroClienteLegales < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-green-400 to-green-50"
                }`}
              >
                {Number(totalCobroClienteLegales).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-600">
                Rendiciones cargadas.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalCobroRendiciones < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-green-400 to-green-50"
                }`}
              >
                {Number(totalCobroRendiciones).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total en fletes cobrado.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalFletes < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-green-400 to-green-50"
                }`}
              >
                {Number(totalFletes).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total en viaticos.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalFletes < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-red-400 to-red-100"
                }`}
              >
                {Number(
                  totalEnViaticosGeneradosEnLegalesUsuario +
                    totalEnViaticosGeneradosEnRemunercionesUsuario
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total en refuerzos.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalFletes < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-red-400 to-red-100"
                }`}
              >
                {Number(
                  totalGeneradoEnRefuerzosLegalesUsuario +
                    totalGeneradoEnRefuerzosUsuario
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total en vehiculos.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalFletes < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-red-400 to-red-100"
                }`}
              >
                {Number(
                  totalEnVehiculoRemuneraciones + totalEnVehiculoLegales
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total en fletero gasto.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent ${
                  totalFletes < 0
                    ? "bg-gradient-to-r from-red-400 to-red-100"
                    : "bg-gradient-to-r from-red-400 to-red-100"
                }`}
              >
                {Number(
                  totalFleteroRemuneraciones + totalFleteroLegales
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total contratos entregados.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-100`}
              >
                {totalContratos}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total metros cuadrados entregados.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-100`}
              >
                {totalMetrosCuadrados.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total contratos de salidas
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-100`}
              >
                {totalContratosEnSalidas}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-300">
                Total metros cuadrados en salidas.
              </p>
              <p
                className={`font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-100`}
              >
                {totalDatosMetrosCudradosSalidas.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {/* <div
          className={`border ${
            totalCajaFiltrada < 0
              ? "border-red-500 rounded-md"
              : "border-gray-300 rounded-md"
          } py-5 px-5 bg-white col-span-2 max-md:col-span-1`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between max-md:flex-col">
              <p className="font-bold">
                Total contratos entregados + rendiciones cargadas.
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
        </div> */}
      </div>

      <div>
        <div className="grid grid-cols-2 px-10 gap-5 py-5 max-md:hidden ">
          <div className="border border-gray-300 py-10 px-10 rounded-md bg-white">
            <ColumnaGastosGananciasGrafico data={combinedData} />
          </div>
          <div className="border border-gray-300 py-10 px-10 rounded-md bg-white">
            <ColumnaEntregasMetrosCuadrados
              data={combinedData}
              salidas={filteredDataSalidas}
            />
          </div>
        </div>
        <div className="border border-gray-300 py-10 px-10 rounded-md mx-10 my-5 max-md:hidden">
          <LineasGraficoDeRecaudaciones data={combinedData} />
        </div>
      </div>
    </section>
  );
};
