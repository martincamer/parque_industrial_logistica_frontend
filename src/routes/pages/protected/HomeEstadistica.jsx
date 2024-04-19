import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RemuneracionesProgressBar from "../../../components/charts/RemuneracionesProgressBar";
import ViviendasProgressBar from "../../../components/charts/ViviendasProgressBar";
import ProgressBarMetrosEntregados from "../../../components/charts/ProgressBarMetrosEntregados";
import client from "../../../api/axios";
import { ImprimirPdfEstadistica } from "../../../components/pdf/ImprimirEstadistica";

export const HomeEstadistica = () => {
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

      const responseCuatro = await client.post("/legales-rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      setSalidasMensuales(response.data);
      setRemuneracionesMensuales(responseDos.data);
      setRendicionesMensuales(responseTres.data);
      setLegales(responseCuatro.data);
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

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const filteredData = selectedUser
    ? remuneracionesMensuales.filter((item) => item.usuario === selectedUser)
    : remuneracionesMensuales;

  const totalContratosGeneradosEnRemuneraciones = filteredData?.reduce(
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

  const totalViaticos =
    totalEnViaticosGeneradosEnLegales + totalEnViaticosGeneradosEnRemunerciones;
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

  // const gastosDelDia = salidasMensuales?.filter(
  //   (item) => item?.created_at?.slice(0, 10) === fechaActualString
  // );

  // const ultimoGastosDelDia = gastosDelDia?.reduce((ultimaGasto, gasto) => {
  //   // Convertir las fechas de cadena a objetos Date para compararlas
  //   const fechaUltimoGasto = new Date(ultimaGasto?.created_at);
  //   const fechaGasto = new Date(gasto?.created_at);

  //   // Retornar la venta con la hora más reciente
  //   return fechaGasto > fechaUltimoGasto ? gasto : ultimaGasto;
  // }, gastosDelDia[0]);

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

  return (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-10 max-md:gap-8 py-20 max-md:mb-10">
      <div className="flex gap-5 items-center">
        <h3 className="text-lg font-semibold uppercase text-slate-600 underline mt-4 md:px-4 max-md:text-base">
          ESTADISTICA FILTRAR
        </h3>

        <PDFDownloadLink
          target="_blank"
          download={false}
          document={
            <ImprimirPdfEstadistica
              totalCobroCliente={totalCobroCliente}
              totalCobroRendiciones={totalCobroRendiciones}
              totalCobroClienteLegales={totalCobroClienteLegales}
              totalDatos={totalDatos}
              totalDatosDos={totalDatosDos}
              totalDatosMetrosCuadrados={totalDatosMetrosCuadrados}
              totalDatosMetrosCuadradosLegales={
                totalDatosMetrosCuadradosLegales
              }
            />
          }
          className="hover:shadow-md hover:shadow-gray-300 transition-all ease-linear bg-green-100 py-3 px-3 rounded-xl text-green-700 uppercase text-sm flex gap-2 items-center"
        >
          Descargar estadistica final
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </PDFDownloadLink>

        <select
          className="py-3 px-4 rounded-xl bg-white border-[1px] border-slate-300 uppercase"
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
      </div>
      <div className="px-6 border-slate-200 border-[1px] py-4 rounded-xl hover:shadow">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start max-md:gap-3">
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700 max-md:text-sm uppercase">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
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
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
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

      {loading ? (
        <div className="flex flex-col gap-12">
          <div className="py-10 px-10 rounded-xl bg-white border-slate-200 border-[1px] shadow grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-slate-200 shadow bg-gray-200 p-12 max-md:p-3"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-white grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-slate-200 bg-gray-200 p-8 max-md:p-3 shadow"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white grid grid-cols-1 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-slate-200 bg-gray-200 p-8 max-md:p-3 shadow h-[50vh]"
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="uppercase grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div
                className={`inline-flex gap-2 self-end rounded py-1 px-1   ${
                  totalCobroCliente +
                    totalCobroRendiciones +
                    totalCobroClienteLegales / 100000 <
                  0
                    ? "bg-red-100 p-1 text-red-600"
                    : totalCobroCliente +
                        totalCobroRendiciones +
                        totalCobroClienteLegales / 100000 >
                      0
                    ? "text-green-600 bg-green-100"
                    : "bg-green-100 text-green-600"
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
                  className={`text-xs font-medium uppercase ${
                    totalCobroCliente +
                      totalCobroRendiciones +
                      totalCobroClienteLegales / 100000 <
                    0
                      ? "text-red-500"
                      : totalCobroCliente +
                          totalCobroRendiciones +
                          totalCobroClienteLegales / 100000 >
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
                    ) / 100000
                  ).toFixed(2)}{" "}
                  %
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Total en remuraciones + rendiciones final con descuentos de
                  legales /{" "}
                  <span className="font-bold text-slate-800">FINAL CAJA</span>
                </strong>

                <p className="text-slate-500">
                  <span
                    className={`text-2xl max-md:text-base font-medium uppercase ${totalClass}`}
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
                    Total final remunerado del mes {"  "}
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
            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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

                <span className="text-xs font-medium uppercase">
                  {" "}
                  {Number(Number(totalCobroCliente) / 100000).toFixed(2)} %{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-green-600 max-md:text-xs">
                  Total en remuneración del mes
                </strong>

                <p className="text-slate-500">
                  <span className="text-2xl max-md:text-base font-medium uppercase text-green-600">
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
                    ultima remuneración del día, el total es de{" "}
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

            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
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

                <span className="text-xs font-medium uppercase">
                  {" "}
                  {Number(Number(totalCobroClienteLegales) / 100000).toFixed(
                    2
                  )}{" "}
                  %{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Total en legales del mes
                </strong>

                <p className="text-slate-500">
                  <span className="text-2xl max-md:text-base font-medium uppercase text-red-500">
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
                    ultima remuneración legal del día, el total es de{" "}
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

            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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

                <span className="text-xs font-medium uppercase">
                  {nombreMesActual}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Fecha Actual
                </strong>

                <p>
                  <span className="text-2xl font-medium uppercase text-gray-900 max-md:text-base">
                    {nombreMesActual}
                  </span>

                  <span className="text-xs text-gray-500">
                    {" "}
                    Dia {nombreDiaActual}
                  </span>
                </p>
              </div>
            </article>

            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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

                <span className="text-xs font-medium uppercase">
                  {" "}
                  {Number(totalDatos + totalDatosDos / 10000).toFixed(2)} %{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Total viviendas entregadas/contratos
                </strong>

                <p>
                  <span className="text-3xl max-md:text-base font-medium uppercase text-gray-900">
                    {totalDatos + totalDatosDos}
                  </span>

                  <span className="text-xs text-gray-500">
                    {" "}
                    Total en el mes {totalDatos + totalDatosDos}{" "}
                  </span>
                </p>
              </div>
            </article>
            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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

                <span className="text-xs font-medium uppercase">
                  {" "}
                  {Number(
                    totalDatosMetrosCuadrados +
                      totalDatosMetrosCuadradosLegales / 10000
                  ).toFixed(2)}{" "}
                  %{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Total en metros cuadradados
                </strong>

                <p>
                  <span className="text-3xl font-medium uppercase text-gray-900 max-md:text-base">
                    {Number(
                      totalDatosMetrosCuadrados +
                        totalDatosMetrosCuadradosLegales
                    ).toFixed(2)}
                  </span>

                  <span className="text-xs text-gray-500">
                    {" "}
                    Total en el mes{" "}
                    {Number(
                      totalDatosMetrosCuadrados +
                        totalDatosMetrosCuadradosLegales
                    ).toFixed(2)}{" "}
                    mts{" "}
                  </span>
                </p>
              </div>
            </article>
            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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

                <span className="text-xs font-medium uppercase">
                  {" "}
                  {Number(Number(totalFletes) / 100000).toFixed(2)} %{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Total en fletes del mes
                </strong>

                <p className="text-slate-500">
                  <span className="text-2xl max-md:text-base font-medium uppercase text-slate-900">
                    {Number(Number(totalFletes)).toLocaleString("es-AR", {
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
                    ultimos en fletes del mes{" "}
                    {Number(totalFletes || 0).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </span>
                </p>
              </div>
            </article>
            <article className="hover:shadow flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 max-md:p-3">
              <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
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

                <span className="text-xs font-medium uppercase">
                  {" "}
                  {Number(Number(totalViaticos) / 100000).toFixed(2)} %{" "}
                </span>
              </div>

              <div>
                <strong className="block text-sm font-medium uppercase text-gray-500 max-md:text-xs">
                  Total en viaticos del mes
                </strong>

                <p className="text-slate-500">
                  <span className="text-2xl max-md:text-base font-medium uppercase text-red-600">
                    {Number(Number(totalViaticos)).toLocaleString("es-AR", {
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
                    ultimos en viaticos del mes{" "}
                    {Number(totalViaticos || 0).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </span>
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
            {/* <SalidasProgressBar salidasMensuales={filteredDataRendiciones} /> */}
            <ViviendasProgressBar
              salidasMensuales={filteredData}
              legales={filteredDataLegales}
            />
            <ProgressBarMetrosEntregados
              salidasMensuales={filteredData}
              legales={filteredDataLegales}
            />
          </div>

          {/* <div className="bg-white h-full w-full">
            <div className="border-slate-200 border-[1px] rounded-xl shadow py-10 max-md:py-5 px-5 max-md:px-2 flex flex-col items-center w-full">
              <div className="font-bold text-slate-700 mb-16 max-md:text-sm">
                GRAFICO DE REMUNERACIONES
              </div>
              <RemuneracionesColumnChart
                rendicionesMensuales={rendicionesMensuales}
                remuneraciones={remuneracionesMensuales}
              />
            </div>
          </div>

          <div className="bg-white h-full w-full">
            <div className="border-slate-200 border-[1px] rounded-xl shadow py-10 max-md:py-5 px-5 max-md:px-2 flex flex-col items-center w-full">
              <div className="font-bold text-slate-700 mb-16 max-md:text-sm">
                GRAFICO DE RENDICIONES
              </div>
              <RendicionesColumnChart
                rendicionesMensuales={rendicionesMensuales}
              />
            </div>
          </div>

          <div className="w-full grid-cols-2 grid gap-3 items-start justify-center max-md:grid-cols-1">
            <div className="border-slate-200 border-[1px] rounded-xl shadow py-10 px-5 flex flex-col items-center max-md:py-5">
              <div className="font-bold text-slate-700 mb-16 max-md:text-sm">
                DONUT REMUNERACIONES
              </div>
              <RemuneracionesDonutChart
                remuneraciones={remuneracionesMensuales}
              />
            </div>
            <ViviendasDataCharts salidasMensuales={salidasMensuales} />
          </div> */}
        </>
      )}
    </section>
  );
};
