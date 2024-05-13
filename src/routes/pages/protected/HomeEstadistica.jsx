import { useState } from "react";
import RemuneracionesProgressBar from "../../../components/charts/RemuneracionesProgressBar";
import ViviendasProgressBar from "../../../components/charts/ViviendasProgressBar";
import ProgressBarMetrosEntregados from "../../../components/charts/ProgressBarMetrosEntregados";
import client from "../../../api/axios";
import { useAuth } from "../../../context/AuthProvider";

export const HomeEstadistica = () => {
  const { user } = useAuth();

  const [salidasMensuales, setSalidasMensuales] = useState([]);
  const [remuneracionesMensuales, setRemuneracionesMensuales] = useState([]);
  const [rendicionesMensuales, setRendicionesMensuales] = useState([]);
  const [legales, setLegales] = useState([]);

  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const obtenerDatosRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      // Setea el estado de loading a true para mostrar el spinner
      setLoading(true);

      // Validación de fechas
      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      // Verifica y formatea las fechas
      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      if (user.localidad === "admin") {
        const response = await client.post("/salidas-rango-fechas-admin", {
          fechaInicio,
          fechaFin,
        });

        const responseDos = await client.post(
          "/remuneraciones-rango-fechas-admin",
          {
            fechaInicio,
            fechaFin,
          }
        );

        const responseTres = await client.post(
          "/rendiciones-rango-fechas-admin",
          {
            fechaInicio,
            fechaFin,
          }
        );

        const responseCuatro = await client.post(
          "/legales/rango-fechas-admin",
          {
            fechaInicio,
            fechaFin,
          }
        );

        setSalidasMensuales(response.data);
        setRemuneracionesMensuales(responseDos.data);
        setRendicionesMensuales(responseTres.data);
        setLegales(responseCuatro.data);
      } else {
        const response = await client.post("/salidas-rango-fechas", {
          fechaInicio,
          fechaFin,
        });

        const responseDos = await client.post("/remuneraciones-rango-fechas", {
          fechaInicio,
          fechaFin,
        });

        const responseTres = await client.post("/rendiciones-rango-fechas", {
          fechaInicio,
          fechaFin,
        });

        const responseCuatro = await client.post("/legales/rango-fechas", {
          fechaInicio,
          fechaFin,
        });

        setSalidasMensuales(response.data);
        setRemuneracionesMensuales(responseDos.data);
        setRendicionesMensuales(responseTres.data);
        setLegales(responseCuatro.data);
      }
    } catch (error) {
      console.error("Error al obtener salidas:", error);
      // Maneja el error según tus necesidades
    } finally {
      // Independientemente de si la solicitud es exitosa o falla, establece el estado de loading a false
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerDatosRangoFechas(fechaInicio, fechaFin);
  };

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual];

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleChangeLocalidad = (event) => {
    setSelectedLocalidad(event.target.value);
  };

  const filteredData = remuneracionesMensuales.filter(
    (item) =>
      (selectedUser === "" || item.usuario === selectedUser) &&
      (selectedLocalidad === "" || item.localidad === selectedLocalidad)
  );

  const totalEnFletesGeneradosEnRemunerciones = filteredData?.reduce(
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

  const totalEnViaticosGeneradosEnRemunerciones = filteredData?.reduce(
    (total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    },
    0
  );

  const filteredDataLegales = selectedUser
    ? legales.filter((item) => item.usuario === selectedUser)
    : legales;

  console.log(filteredDataLegales);

  const totalContratosGeneradosEnLegales = filteredDataLegales?.reduce(
    (total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente
          ? salida?.datos_cliente?.datosCliente.length
          : 0)
      );
    },
    0
  );

  const totalEnFletesGeneradosEnLegales = filteredDataLegales?.reduce(
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

  const totalEnViaticosGeneradosEnLegales = filteredDataLegales?.reduce(
    (total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    },
    0
  );

  const totalEnRefuerzosGeneradosEnLegales = filteredDataLegales?.reduce(
    (total, salida) => {
      return total + (salida?.refuerzo ? Number(salida.refuerzo) : 0);
    },
    0
  );

  const totalEnRefuerzosGeneradosEnRemuneracion = filteredData?.reduce(
    (total, salida) => {
      return total + (salida?.refuerzo ? Number(salida.refuerzo) : 0);
    },
    0
  );

  const totalViaticos =
    totalEnViaticosGeneradosEnLegales + totalEnViaticosGeneradosEnRemunerciones;

  const totalRefuerzos =
    totalEnRefuerzosGeneradosEnRemuneracion +
    totalEnRefuerzosGeneradosEnLegales;

  const totalFletes =
    totalEnFletesGeneradosEnLegales + totalEnFletesGeneradosEnRemunerciones;

  console.log(totalViaticos, totalFletes);

  const filteredDataRendiciones = selectedUser
    ? rendicionesMensuales.filter((item) => item.usuario === selectedUser)
    : remuneracionesMensuales;

  const totalCobroCliente = filteredData.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegales = filteredDataLegales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendiciones = filteredDataRendiciones.reduce(
    (total, item) => total + parseFloat(item.rendicion_final || 0),
    0
  );

  // Obtener la fecha en formato de cadena (YYYY-MM-DD)
  const fechaActualString = fechaActual.toISOString().slice(0, 10);

  // Filtrar los objetos de 'data' que tienen la misma fecha que la fecha actual
  const ventasDelDia = remuneracionesMensuales?.filter(
    (item) => item.created_at.slice(0, 10) === fechaActualString
  );

  const ventasDelDiaDos = legales?.filter(
    (item) => item.created_at.slice(0, 10) === fechaActualString
  );

  // Encontrar la venta más reciente del día
  const ultimaVentaDelDia = ventasDelDia?.reduce((ultimaVenta, venta) => {
    // Convertir las fechas de cadena a objetos Date para compararlas
    const fechaUltimaVenta = new Date(ultimaVenta?.created_at);
    const fechaVenta = new Date(venta.created_at);

    // Retornar la venta con la hora más reciente
    return fechaVenta > fechaUltimaVenta ? venta : ultimaVenta;
  }, ventasDelDia[0]);

  // Encontrar la venta más reciente del día
  const ultimaVentaDelDiaDos = ventasDelDiaDos?.reduce(
    (ultimaVentaDos, venta) => {
      // Convertir las fechas de cadena a objetos Date para compararlas
      const fechaUltimaVenta = new Date(ultimaVentaDos?.created_at);
      const fechaVenta = new Date(venta.created_at);

      // Retornar la venta con la hora más reciente
      return fechaVenta > fechaUltimaVenta ? venta : ultimaVentaDos;
    },
    ventasDelDia[0]
  );

  const totalDatos = filteredData?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosDos = filteredDataLegales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadrados = filteredData?.reduce((total, salida) => {
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

  const totalCobro =
    Number(totalCobroCliente + totalCobroRendiciones) +
    Number(totalCobroClienteLegales);

  // Determinar si el total es menor, mayor o igual a cero
  let totalClass = "";
  if (totalCobro < 0) {
    totalClass = "text-red-500";
  } else if (totalCobro > 0) {
    totalClass = "text-green-500";
  } else {
    totalClass = "text-gray-500"; // Otra clase para cero si lo deseas
  }

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(
      remuneracionesMensuales.map((remuneracion) =>
        remuneracion.usuario.toLowerCase()
      )
    )
  );

  const uniqueLocalidad = Array.from(
    new Set(
      remuneracionesMensuales.map((remuneracion) =>
        remuneracion.localidad.toLowerCase()
      )
    )
  );

  return (
    <section className="bg-gray-100/50 w-full h-full min-h-screen max-h-full px-12 max-md:px-4 flex flex-col gap-10 max-md:gap-8 py-20 max-md:mb-10">
      <div>
        <p className="font-bold text-2xl text-slate-600 max-md:text-lg max-md:text-center text-justify">
          Bienvenido{" "}
          <span className="capitalize text-green-500/90 underline">
            {user.username}
          </span>{" "}
          a la parte de filtrar estadisticas 🖐️.
        </p>
      </div>
      <div className="flex gap-5 items-center overflow-x-scroll scrollbar-hidden max-md:gap-2">
        <h3 className="text-lg font-semibold uppercase text-slate-600 underline mt-4 md:px-4 max-md:text-sm max-md:hidden">
          ESTADISTICA FILTRAR
        </h3>

        <select
          className="py-3 px-4 rounded-xl bg-white border-[1px] border-slate-300 uppercase max-md:py-1.5 max-md:text-sm max-md:font-bold"
          value={selectedUser}
          onChange={handleChange}
        >
          <option value="">SELECCIONAR USUARIO</option>

          {uniqueUsers.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>

        <select
          className="py-3 px-4 rounded-xl bg-white border-[1px] border-slate-300 uppercase max-md:py-1.5 max-md:text-sm max-md:font-bold"
          value={selectedLocalidad}
          onChange={handleChangeLocalidad}
        >
          <option value="">SELECCIONAR LOCALIDAD</option>

          {uniqueLocalidad.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white px-6 border-slate-200 border-[1px] py-4 rounded-xl hover:shadow max-md:border-none max-md:shadow-lg max-md:hover:shadow-lg">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start max-md:gap-3">
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700 max-md:text-sm uppercase">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none max-md:font-bold"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700 max-md:text-sm uppercase">
              Fecha fin
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none max-md:font-bold"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <button
              onClick={buscarIngresosPorFecha}
              className="max-md:text-sm bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:block md:hidden max-md:py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={buscarIngresosPorFecha}
            className="max-md:text-sm bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <>
        <div className="uppercase grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:overflow-y-scroll max-md:h-[30vh] max-md:px-4 scroll-bar">
          <article
            className={`${
              totalCobro > 0
                ? "bg-green-500/90"
                : " bg-red-500/90"
                ? totalCobro === 0 && "bg-white border-[1px] border-slate-200"
                : ""
            } hover:shadow flex flex-col gap-4 rounded-2xl p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none`}
          >
            <div
              className={`inline-flex gap-2 self-end rounded-2xl py-3 px-3   ${
                totalCobroCliente +
                  totalCobroRendiciones +
                  totalCobroClienteLegales <
                0
                  ? "bg-white p-1 text-red-500"
                  : totalCobroCliente +
                      totalCobroRendiciones +
                      totalCobroClienteLegales >
                    0
                  ? "text-green-600 bg-white"
                  : "bg-green-100 text-green-600"
                  ? "border shadow"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span
                className={`text-xs font-bold uppercase ${
                  totalCobroCliente +
                    totalCobroRendiciones +
                    totalCobroClienteLegales <
                  0
                    ? "text-red-500"
                    : totalCobroCliente +
                        totalCobroRendiciones +
                        totalCobroClienteLegales >
                      0
                    ? "text-green-500"
                    : ""
                }`}
              >
                {(
                  Number(
                    totalCobroCliente +
                      totalCobroRendiciones +
                      totalCobroClienteLegales
                  ) % 100
                ).toFixed(2)}{" "}
                %
              </span>
            </div>

            <div className="bg-white py-2 px-2 rounded-xl">
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total en final de la caja /{" "}
                <span className="font-bold text-slate-800">FINAL CAJA</span>
              </strong>

              <p className="text-slate-500">
                <span
                  className={`text-2xl max-md:text-base font-bold uppercase ${
                    totalCobroCliente > 0
                      ? "text-green-500"
                      : "text-red-500"
                      ? "text-slate-700"
                      : "text-slate-700"
                  }`}
                >
                  {totalCobro.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}{" "}
                </span>
                <span
                  className={`text-xs
                 `}
                >
                  Total final remunerado{"  "}
                  {Number(
                    Number(totalCobroCliente + totalCobroRendiciones) +
                      Number(totalCobroClienteLegales) || 0
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>
          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div
              className={`inline-flex gap-2 self-end rounded-2xl p-3 ${
                totalCobroCliente > 0
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                  ? "text-slate-700 border"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(Number(totalCobroCliente) % 100).toFixed(2)} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-slate-600 max-md:text-xs">
                Total contratos - remuneraciónes filtradas
              </strong>

              <p className="text-slate-500">
                <span
                  className={`text-2xl max-md:text-base font-bold uppercase ${
                    totalCobroCliente > 0
                      ? "text-green-500"
                      : "text-red-500"
                      ? "text-slate-700"
                      : ""
                  }`}
                >
                  {Number(Number(totalCobroCliente)).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>{" "}
                <span
                  className={`text-xs
                 `}
                >
                  {" "}
                  ultima remuneración del día, cargada{" "}
                  {Number(ultimaVentaDelDia?.recaudacion || 0).toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    }
                  )}
                </span>
              </p>
            </div>
          </article>

          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div
              className={`inline-flex gap-2 self-end rounded-2xl p-3 ${
                totalCobroClienteLegales < 0
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
                  ? "border text-slate-700"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(Number(totalCobroClienteLegales) % 100).toFixed(
                  2
                )} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total contratos legales filtrados
              </strong>

              <p className="text-slate-500">
                <span
                  className={`text-2xl max-md:text-base font-bold uppercase ${
                    totalCobroClienteLegales < 0
                      ? "text-red-500"
                      : "text-green-500"
                      ? "text-slate-700"
                      : ""
                  }`}
                >
                  {Number(totalCobroClienteLegales).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>{" "}
                <span
                  className={`text-xs
                 `}
                >
                  ultimo contrato legal del día cargada{" "}
                  {Number(
                    ultimaVentaDelDiaDos?.recaudacion || 0
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>

          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div
              className={`inline-flex gap-2 self-end rounded-2xl p-3 border`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {nombreMesActual}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Fecha Actual
              </strong>

              <p>
                <span className="text-2xl font-bold uppercase text-gray-900 max-md:text-base">
                  {nombreMesActual}
                </span>

                <span className="text-xs text-gray-500">
                  {" "}
                  Dia {nombreDiaActual}
                </span>
              </p>
            </div>
          </article>

          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500 p-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(totalDatos + (totalDatosDos % 100)).toFixed(2)} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total viviendas entregadas/contratos
              </strong>

              <p>
                <span className="text-3xl max-md:text-base font-bold uppercase text-gray-900">
                  {totalDatos + totalDatosDos}
                </span>
              </p>
            </div>
          </article>
          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500 p-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(
                  totalDatosMetrosCuadrados +
                    (totalDatosMetrosCuadradosLegales % 100)
                ).toFixed(2)}{" "}
                %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total en metros cuadradados
              </strong>

              <p>
                <span className="text-3xl font-bold uppercase text-gray-900 max-md:text-base">
                  {Number(
                    totalDatosMetrosCuadrados + totalDatosMetrosCuadradosLegales
                  ).toFixed(2)}{" "}
                  mts
                </span>
              </p>
            </div>
          </article>
          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-red-500 p-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(Number(totalFletes) % 100).toFixed(2)} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total en fletes filtrados
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold uppercase text-red-500">
                  -{" "}
                  {Number(Number(totalFletes)).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>{" "}
              </p>
            </div>
          </article>
          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-red-500 p-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(Number(totalViaticos) / 100000).toFixed(2)} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total en viaticos filtrados
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold uppercase text-red-500">
                  -{" "}
                  {Number(Number(totalViaticos)).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>{" "}
              </p>
            </div>
          </article>
          <article className="hover:shadow flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 max-md:p-3 max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-red-500 p-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-bold uppercase">
                {" "}
                {Number(Number(totalRefuerzos) % 100).toFixed(2)} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                Total en refuerzos filtrados
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold uppercase text-red-500">
                  {Number(Number(totalRefuerzos)).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>{" "}
              </p>
            </div>
          </article>
        </div>

        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          <div className="hidden md:hidden max-md:block font-semibold text-sm uppercase text-slate-600 underline">
            <p> Progreso de las entregas</p>
          </div>
          <RemuneracionesProgressBar
            rendicionesMensuales={filteredDataRendiciones}
            remuneracionesMensuales={filteredData}
          />
          <ViviendasProgressBar
            salidasMensuales={filteredData}
            legales={filteredDataLegales}
          />
          <ProgressBarMetrosEntregados
            salidasMensuales={filteredData}
            legales={filteredDataLegales}
          />
        </div>
      </>
    </section>
  );
};
