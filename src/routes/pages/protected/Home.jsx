import { useEffect, useState } from "react";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { useAuth } from "../../../context/AuthProvider";
import RemuneracionesProgressBar from "../../../components/charts/RemuneracionesProgressBar";
import SalidasProgressBar from "../../../components/charts/SalidasProgressBar";
import ViviendasProgressBar from "../../../components/charts/ViviendasProgressBar";
import ApexChart from "../../../components/apexchart/ApexChart";
import ApexColumnChart from "../../../components/apexchart/ApexChartColumn";

export const Home = () => {
  const { user } = useAuth();
  const { salidasMensuales, salidasMensualesAdmin } = useSalidasContext();
  const {
    remuneracionesMensuales,
    remuneraciones,
    remuneracionesAdmin,
    remuneracionesMensualesAdmin,
  } = useRemuneracionContext();

  const {
    rendicionesMensuales,
    rendiciones,
    rendicionesAdmin,
    rendicionesMensualesAdmin,
  } = useRendicionesContext();
  const { legales, legalesReal, legalesAdmin, legalesMensualesAdmin } =
    useLegalesContext();

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

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  const totalCobroCliente = remuneracionesMensuales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegales = legales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendiciones = rendicionesMensuales.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const totalCobroClienteDos = remuneraciones.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegalesDos = legalesReal.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendicionesDos = rendiciones.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const totalGastosCliente = salidasMensuales.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera),
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

  // Filtrar los objetos de 'data' que tienen la misma fecha que la fecha actual

  const gastosDelDia = salidasMensuales?.filter(
    (item) => item?.created_at?.slice(0, 10) === fechaActualString
  );

  const ultimoGastosDelDia = gastosDelDia?.reduce((ultimaGasto, gasto) => {
    // Convertir las fechas de cadena a objetos Date para compararlas
    const fechaUltimoGasto = new Date(ultimaGasto?.created_at);
    const fechaGasto = new Date(gasto?.created_at);

    // Retornar la venta con la hora más reciente
    return fechaGasto > fechaUltimoGasto ? gasto : ultimaGasto;
  }, gastosDelDia[0]);

  const totalDatos = remuneracionesMensuales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosDos = legales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadrados = remuneracionesMensuales?.reduce(
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

  const totalDatosMetrosCuadradosLegales = legales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
        return subtotal + Number(cliente.metrosCuadrados);
      }, 0) || 0)
    );
  }, 0);

  const totalCobro =
    Number(totalCobroCliente + totalCobroRendiciones) +
    Number(totalCobroClienteLegales);

  const totalCobroDos =
    Number(totalCobroClienteDos + totalCobroRendicionesDos) +
    Number(totalCobroClienteLegalesDos);

  // Determinar si el total es menor, mayor o igual a cero
  let totalClass = "";
  if (totalCobro < 0) {
    totalClass = "text-red-500";
  } else if (totalCobro > 0) {
    totalClass = "text-green-500";
  } else {
    totalClass = "text-gray-500"; // Otra clase para cero si lo deseas
  }

  // Determinar si el total es menor, mayor o igual a cero
  let totalClassDos = "";
  if (totalCobroDos < 0) {
    totalClassDos = "text-red-500";
  } else if (totalCobroDos > 0) {
    totalClassDos = "text-green-500";
  } else {
    totalClassDos = "text-green-500"; // Otra clase para cero si lo deseas
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula una carga asíncrona
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simula 2 segundos de carga

    // Limpia el temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, []);

  const totalCaja = Number(
    totalCobroClienteDos +
      totalCobroRendicionesDos +
      totalCobroClienteLegalesDos
  );

  ///////////////////ADMIN DATOS - TODO////////////////////////////

  const totalCobroClienteAdmin = remuneracionesMensualesAdmin.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegalesAdmin = legalesMensualesAdmin.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendicionesAdmin = rendicionesMensualesAdmin.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const totalDatosAdmin = remuneracionesMensualesAdmin?.reduce(
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

  const totalDatosDosAdmin = legalesMensualesAdmin?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadradosAdmin = remuneracionesMensualesAdmin?.reduce(
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

  const totalDatosMetrosCuadradosLegalesAdmin = legalesMensualesAdmin?.reduce(
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

  const totalCobroSalidasAdmin = salidasMensualesAdmin.reduce((total, item) => {
    const totalFlete = parseFloat(item.total_flete);
    const totalControl = parseFloat(item.total_control);
    const totalViaticos = parseFloat(item.total_viaticos);
    const espera = parseFloat(item.espera);

    // Asegúrate de que los valores sean números válidos
    if (
      !isNaN(totalFlete) &&
      !isNaN(totalControl) &&
      !isNaN(totalViaticos) &&
      !isNaN(espera)
    ) {
      return total + totalFlete + totalControl + totalViaticos + espera;
    } else {
      console.warn("Datos no válidos en:", item);
      return total;
    }
  }, 0);

  const resultadoNegativo =
    totalCobroSalidasAdmin > 0
      ? -totalCobroSalidasAdmin
      : totalCobroSalidasAdmin;

  const totalCobroClienteDosAdmin = remuneracionesAdmin.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroClienteLegalesDosAdmin = legalesAdmin.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalCobroRendicionesDosAdmin = rendicionesAdmin.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const totalCobroAdmin =
    Number(totalCobroClienteDosAdmin + totalCobroRendicionesDosAdmin) +
    Number(totalCobroClienteLegalesDosAdmin);

  const totalCobroAdminFinalMes =
    Number(totalCobroClienteAdmin + totalCobroRendicionesAdmin) +
    Number(totalCobroClienteLegalesAdmin);

  // Determinar si el total es menor, mayor o igual a cero
  let totalClassAdmin = "";

  if (totalCobroAdmin < 0) {
    totalClassAdmin = "text-red-600";
  } else if (totalCobroAdmin > 0) {
    totalClassAdmin = "text-green-600";
  } else {
    totalClassAdmin = "text-green-600"; // Otra clase para cero si lo deseas
  }

  const totalCajaAdmin = Number(
    totalCobroClienteDosAdmin +
      totalCobroRendicionesDosAdmin +
      totalCobroClienteLegalesDosAdmin
  );

  const totalEnFletesGeneradosEnRemunerciones =
    remuneracionesMensualesAdmin?.reduce((total, salida) => {
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

  const totalEnViaticosGeneradosEnRemunerciones =
    remuneracionesMensualesAdmin?.reduce((total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    }, 0);

  const totalEnFletesGeneradosEnLegales = legalesMensualesAdmin?.reduce(
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

  const totalEnViaticosGeneradosEnLegales = legalesMensualesAdmin?.reduce(
    (total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    },
    0
  );

  const totalGeneradoEnRefuerzosAdmin = remuneracionesMensualesAdmin?.reduce(
    (total, salida) => {
      return total + Number(salida.refuerzo || 0); // Asegúrate de que salida.refuerzo es un número
    },
    0
  );

  const totalGeneradoEnRefuerzosLegalesAdmin = legalesMensualesAdmin?.reduce(
    (total, salida) => {
      return total + Number(salida.refuerzo || 0); // Asegúrate de que salida.refuerzo es un número
    },
    0
  );

  const totalRefuerzosAdmin =
    totalGeneradoEnRefuerzosAdmin + totalGeneradoEnRefuerzosLegalesAdmin;

  const totalViaticos =
    totalEnViaticosGeneradosEnLegales + totalEnViaticosGeneradosEnRemunerciones;

  const totalFletes =
    totalEnFletesGeneradosEnLegales + totalEnFletesGeneradosEnRemunerciones;

  /////////////////////USUARIO DATOS///////////////
  const totalEnFletesGeneradosEnRemunercionesUsuario =
    remuneracionesMensuales?.reduce((total, salida) => {
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
    remuneracionesMensuales?.reduce((total, salida) => {
      return total + (salida?.viaticos ? Number(salida.viaticos) : 0);
    }, 0);

  const totalEnFletesGeneradosEnLegalesUsuario = legales?.reduce(
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

  const totalGeneradoEnRefuerzosUsuario = remuneracionesMensuales?.reduce(
    (total, salida) => {
      return total + Number(salida.refuerzo || 0); // Asegúrate de que salida.refuerzo es un número
    },
    0
  );

  const totalGeneradoEnRefuerzosLegalesUsuario = legales?.reduce(
    (total, salida) => {
      return total + Number(salida.refuerzo || 0); // Asegúrate de que salida.refuerzo es un número
    },
    0
  );

  const totalRefuerzosUsuario =
    totalGeneradoEnRefuerzosUsuario + totalGeneradoEnRefuerzosLegalesUsuario;

  const totalViaticosUsuario =
    totalEnViaticosGeneradosEnLegalesUsuario +
    totalEnViaticosGeneradosEnRemunercionesUsuario;

  const totalFletesUsuario =
    totalEnFletesGeneradosEnLegalesUsuario +
    totalEnFletesGeneradosEnRemunercionesUsuario;

  console.log("legales", legales);
  console.log("remuneraciones", remuneracionesMensuales);

  return user.localidad === "admin" ? (
    <section className="w-full h-full min-h-full max-h-full px-10 max-md:px-6 flex flex-col gap-16 max-md:gap-8 py-36 max-md:mb-10 max-md:py-16 bg-gray-100/50">
      <div>
        <p className="font-bold text-2xl text-slate-600 max-md:text-xl max-md:text-center">
          Bienvenido{" "}
          <span className="capitalize text-green-500/90 underline">
            {user.username}
          </span>{" "}
          a la parte de estadisticas del mes 🖐️.
        </p>
      </div>
      <div className="md:overflow-y-auto scroll-bar md:h-[30vh] max-md:scrollbar-hidden max-md:overflow-y-scroll max-md:h-[30vh] max-md:px-3">
        <div className="grid md:grid-cols-3 max-md:grid-cols-1 w-full gap-2 px-2 max-md:px-0">
          <article
            className={`flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear  p-5 max-md:rounded-xl cursor-pointer ${
              totalCobroClienteDosAdmin +
                totalCobroClienteLegalesDosAdmin +
                (totalCobroRendicionesDosAdmin % 100) >
              0
                ? "bg-green-500/60 border-green-500/60"
                : "bg-red-500/90"
            }`}
          >
            <span className="flex gap-2 justify-between">
              <div className="mt-2  flex">
                <p className="bg-white py-2 px-6 rounded-xl shadow">
                  <span
                    className={`text-2xl max-md:text-base font-bold uppercase ${
                      totalCobroAdmin >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {totalCobroAdmin.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}{" "}
                  </span>
                </p>
              </div>

              <div
                className={`inline-flex gap-2 self-end rounded-2xl py-3 px-2   ${
                  totalCobroClienteDosAdmin +
                    totalCobroClienteLegalesDosAdmin +
                    (totalCobroRendicionesDosAdmin % 100) <
                  0
                    ? "bg-white text-red-500"
                    : "bg-white text-green-500"
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
                    totalCobroClienteDosAdmin +
                      totalCobroClienteLegalesDosAdmin +
                      (totalCobroRendicionesDosAdmin % 100) <
                    0
                      ? "text-red-500"
                      : totalCobroClienteDosAdmin +
                          totalCobroClienteLegalesDosAdmin +
                          (totalCobroRendicionesDosAdmin % 100) >
                        0
                      ? "text-green-500"
                      : "text-gray-700"
                  }`}
                >
                  {(
                    Number(
                      totalCobroClienteDosAdmin +
                        totalCobroClienteLegalesDosAdmin +
                        totalCobroRendicionesDosAdmin
                    ) % 100
                  ).toFixed(2)}{" "}
                  %
                </span>
              </div>
            </span>

            <div>
              <div className="flex">
                <strong className="block text-sm font-bold text-gray-700 bg-white shadow py-2 px-4 rounded-xl max-md:text-xs uppercase">
                  Total final de la caja / todas las localidades / fabricas
                </strong>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div
              className={`inline-flex gap-2 p-3 self-end rounded-2xl ${
                Number(totalCobroClienteAdmin + totalCobroRendicionesAdmin) >= 0
                  ? "bg-green-500/90  text-white"
                  : "bg-red-500/90  text-white"
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
                {Number(
                  Number(totalCobroClienteAdmin + totalCobroRendicionesAdmin) %
                    100
                ).toFixed(2)}{" "}
                %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en remuneraciónes del mes
              </strong>

              <p
                className={`${
                  Number(totalCobroClienteAdmin + totalCobroRendicionesAdmin) >=
                  0
                    ? "text-green-500/90"
                    : "text-red-500/90"
                } text-2xl max-md:text-base font-bold`}
              >
                {Number(
                  totalCobroClienteAdmin + totalCobroRendicionesAdmin
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div
              className={`inline-flex gap-2 self-end rounded-2xl ${
                totalCobroClienteLegalesAdmin < 0
                  ? "bg-red-500/90"
                  : "bg-green-500/90"
              } p-3 text-white`}
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>

              <span className="text-xs font-bold">
                {" "}
                {Number(Number(totalCobroClienteLegalesAdmin) % 100).toFixed(
                  2
                )}{" "}
                %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en legales del mes
              </strong>

              <p className="text-slate-500">
                <span
                  className={`text-2xl max-md:text-base font-bold ${
                    totalCobroClienteLegalesAdmin < 0
                      ? "text-red-500/90"
                      : "text-green-500/90"
                  } uppercase`}
                >
                  {Number(totalCobroClienteLegalesAdmin).toLocaleString(
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

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div
              className={`inline-flex gap-2 self-end rounded-2xl p-3   ${
                totalCobroClienteAdmin +
                  totalCobroRendicionesAdmin +
                  (totalCobroClienteLegalesAdmin % 100) <
                0
                  ? "bg-red-500/90 p-3 text-white"
                  : totalCobroClienteAdmin +
                      totalCobroRendicionesAdmin +
                      (totalCobroClienteLegalesAdmin % 100) >
                    0
                  ? "text-white bg-green-500/90"
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
                className={`text-xs font-medium uppercase ${
                  totalCobroClienteAdmin +
                    totalCobroRendicionesAdmin +
                    (totalCobroClienteLegalesAdmin % 100) <
                  0
                    ? "text-white"
                    : totalCobroClienteAdmin +
                        totalCobroRendicionesAdmin +
                        (totalCobroClienteLegalesAdmin % 100) >
                      0
                    ? "text-white"
                    : ""
                }`}
              >
                {(
                  Number(
                    totalCobroClienteAdmin +
                      totalCobroRendicionesAdmin +
                      totalCobroClienteLegalesAdmin
                  ) % 100
                ).toFixed(2)}{" "}
                %
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en remuraciones final con descuentos de legales del mes.
              </strong>

              <p className="text-slate-500">
                <span
                  className={`text-2xl max-md:text-base font-bold uppercase ${
                    totalCobroAdminFinalMes > 0
                      ? "text-green-500/90"
                      : "text-red-500/90"
                  }`}
                >
                  {totalCobroAdminFinalMes.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}{" "}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl p-3 bg-red-500/90 text-white">
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>

              <span className="text-xs font-bold">
                {" "}
                {Number(totalCobroSalidasAdmin % 100).toFixed(2)} %{""}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en salidas registradas del mes
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold text-red-500/90 uppercase">
                  {Number(resultadoNegativo).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-red-500/90 p-3 text-white">
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>

              <span className="text-xs font-bold">
                {" "}
                {Number(totalFletes % 100).toFixed(2)} %{""}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en fletes del mes
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold text-red-500/90 uppercase">
                  -{" "}
                  {Number(totalFletes).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-red-500/90 p-3 text-white">
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
              <span className="text-xs font-bold">
                {" "}
                {Number(totalViaticos % 100).toFixed(2)} %{""}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en viaticos del mes
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                  -{" "}
                  {Number(totalViaticos).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-red-500/90 p-3 text-white">
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>

              <span className="text-xs font-bold">
                {" "}
                {Number(totalRefuerzosAdmin / 100000).toFixed(2)} %{""}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en refuerzos del mes
              </strong>

              <p className="text-slate-500">
                <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                  -{" "}
                  {Number(totalRefuerzosAdmin).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500/90 p-3 text-white">
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
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Fecha Actual
              </strong>

              <p>
                <span className="text-2xl font-bold text-gray-900 max-md:text-base uppercase">
                  {nombreMesActual}
                </span>

                <span className="text-xs text-gray-500 uppercase ml-3">
                  {" "}
                  Dia {nombreDiaActual}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500/90 p-3 text-white">
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

              <span className="text-xs font-bold">
                {" "}
                {Number(totalDatosAdmin + (totalDatosDosAdmin % 100)).toFixed(
                  2
                )}{" "}
                %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total viviendas entregadas
              </strong>

              <p>
                <span className="text-3xl max-md:text-base font-bold text-gray-900">
                  {totalDatosAdmin + totalDatosDosAdmin}
                </span>

                <span className="text-xs text-gray-500 uppercase">
                  {" "}
                  Total en el mes {totalDatosAdmin + totalDatosDosAdmin}{" "}
                </span>
              </p>
            </div>
          </article>
          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500/90 p-3 text-white">
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
                  totalDatosMetrosCuadradosAdmin +
                    (totalDatosMetrosCuadradosLegalesAdmin % 100)
                ).toFixed(2)}{" "}
                %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
                Total en metros cuadradados
              </strong>

              <p>
                <span className="text-3xl font-bold text-gray-900 max-md:text-base uppercase">
                  {Number(
                    totalDatosMetrosCuadradosAdmin +
                      totalDatosMetrosCuadradosLegalesAdmin
                  ).toFixed(2)}
                </span>

                <span className="text-xs text-gray-500 uppercase">
                  {" "}
                  Total en el mes{" "}
                  {Number(
                    totalDatosMetrosCuadradosAdmin +
                      totalDatosMetrosCuadradosLegalesAdmin
                  ).toFixed(2)}{" "}
                  mts{" "}
                </span>
              </p>
            </div>
          </article>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <p className="font-bold text-xl text-slate-600 max-md:text-base max-md:text-center">
            Porcentaje de todo lo cargado en la app 👉.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:overflow-y-scroll max-md:h-[30vh] scroll-bar max-md:px-3">
          <RemuneracionesProgressBar
            rendicionesMensuales={rendicionesMensualesAdmin}
            remuneracionesMensuales={remuneracionesMensualesAdmin}
          />
          <SalidasProgressBar salidasMensuales={salidasMensualesAdmin} />
          <ViviendasProgressBar
            salidasMensuales={remuneracionesMensualesAdmin}
            legales={legalesAdmin}
          />

          <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
              <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
                Total de la caja
              </p>
              <p
                className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
              >
                {Number(totalCajaAdmin).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
              <div
                className={`h-3 ${
                  totalCajaAdmin >= 0 ? "bg-green-400" : "bg-red-400"
                } max-md:h-2`}
                style={{
                  width: `${Math.abs(totalCajaAdmin / 1000000)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start font-semibold">
              <p className="text-lg mb-3 uppercase max-md:text-sm">
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

          <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start font-semibold">
              <p className="text-lg mb-3 uppercase max-md:text-sm">
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

          <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start font-semibold">
              <p className="text-lg mb-3 uppercase max-md:text-sm">
                Total en refuerzos
              </p>
              <p
                className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
              >
                -{" "}
                {Number(totalRefuerzosAdmin).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
              <div
                className={`h-3 ${
                  totalRefuerzosAdmin >= 0 ? "bg-red-400" : "bg-red-400"
                } max-md:h-2`}
                style={{
                  width: `${Math.abs(totalRefuerzosAdmin / 1000000)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-6 flex flex-col gap-10 max-md:gap-8 py-36 max-md:mb-10 max-md:py-16">
      <div>
        <p className="font-bold text-2xl text-slate-600 max-md:text-lg max-md:text-center text-justify">
          Bienvenido{" "}
          <span className="capitalize text-green-500/90 underline">
            {user.username}
          </span>{" "}
          a la parte de estadísticas mensuales 🖐️.
        </p>
      </div>

      <div className="px-3 overflow-y-scroll h-[40vh] grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-3 uppercase scroll-bar max-md:gap-5">
        <article
          className={`shadow-lg flex flex-col gap-4 rounded-2xl p-5 max-md:rounded-xl cursor-pointer  max-md:border-none ${
            totalCaja > 0 ? "bg-green-500" : "border-red-400 bg-red-100"
          }`}
        >
          <div
            className={`inline-flex gap-2 self-end rounded py-2 px-3 ${
              totalCaja < 0
                ? "bg-white text-red-500"
                : "bg-white text-green-500"
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
                totalCaja < 0
                  ? "text-red-500"
                  : totalCaja > 0
                  ? "text-green-500"
                  : ""
              }`}
            >
              {(Number(totalCaja) % 100).toFixed(2)} %
            </span>
          </div>

          <div>
            <div className="flex">
              <strong className="block text-sm font-bold text-slate-600 bg-white shadow py-2 px-4 rounded-xl max-md:text-xs uppercase">
                Total final de la caja
              </strong>
            </div>
            <div className="  mt-2  flex">
              <p className="bg-white py-2 px-6 rounded-xl shadow">
                <span
                  className={`text-2xl max-md:text-base font-bold uppercase ${
                    totalCaja < 0
                      ? "text-red-500"
                      : totalCaja > 0
                      ? "text-green-500"
                      : ""
                  } `}
                >
                  {totalCaja.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}{" "}
                </span>
              </p>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 py-2 px-3 text-green-600">
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
                Number(totalCobroCliente + totalCobroRendiciones) % 100
              ).toFixed(2)}{" "}
              %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total en remuneración del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-bold text-slate-900">
                {Number(
                  Number(totalCobroCliente + totalCobroRendiciones)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span
                className={`text-xs uppercase font-semibold
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 py-2 px-3 text-red-600">
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

            <span className="text-xs font-bold">
              {" "}
              {Number(Number(totalCobroClienteLegales) % 100).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total en legales del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                {Number(totalCobroClienteLegales).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span
                className={`text-xs uppercase font-semibold
                 `}
              >
                ultima remuneración legal del día, el total es de{" "}
                {Number(ultimaVentaDelDiaDos?.recaudacion || 0).toLocaleString(
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div
            className={`inline-flex gap-2 self-end py-2 px-3 rounded  ${
              totalCobroCliente +
                totalCobroRendiciones +
                totalCobroClienteLegales <
              0
                ? "bg-red-100 text-red-600"
                : totalCobroCliente +
                    totalCobroRendiciones +
                    totalCobroClienteLegales >
                  0
                ? "text-green-600 bg-green-100"
                : "bg-gray-100"
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

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en remuraciones final con descuentos de legales del mes.
            </strong>

            <p className="text-slate-500">
              <span
                className={`text-2xl max-md:text-base font-bold uppercase ${
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
                {totalCobro.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}{" "}
              </span>
              <span
                className={`text-xs font-semibold
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 py-2 px-3 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-bold">
              {" "}
              {Number(totalGastosCliente % 100).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total en salidas registradas del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                {Number(totalGastosCliente).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>

              <span className="text-xs text-gray-500 uppercase font-semibold">
                {" "}
                ultimos gastos en salidas en el día{" "}
                {Number(
                  Number(ultimoGastosDelDia?.total_viaticos) +
                    Number(ultimoGastosDelDia?.total_control) +
                    Number(ultimoGastosDelDia?.total_flete) +
                    Number(ultimoGastosDelDia?.espera) || 0
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}{" "}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 py-2 px-3 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-bold">
              {" "}
              {Number(totalFletesUsuario % 100).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total en fletes del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                -{" "}
                {Number(totalFletesUsuario).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 py-2 px-3 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <span className="text-xs font-bold">
              {" "}
              {Number(totalViaticosUsuario % 100).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total en viaticos del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                -{" "}
                {Number(totalViaticosUsuario).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 py-2 px-3 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-bold">
              {" "}
              {Number(totalRefuerzosUsuario % 100).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en refuerzos del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-bold text-red-500 uppercase">
                -{" "}
                {Number(totalRefuerzosUsuario).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 py-2 px-3 text-green-600">
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
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl font-bold text-gray-900 max-md:text-base uppercase">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500 uppercase font-semibold">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 py-2 px-3 text-green-600">
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

            <span className="text-xs font-bold">
              {" "}
              {Number(totalDatos + (totalDatosDos % 100)).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total viviendas entregadas
            </strong>

            <p>
              <span className="text-3xl max-md:text-base font-bold text-gray-900">
                {totalDatos + totalDatosDos}
              </span>

              <span className="text-xs text-gray-500 uppercase font-semibold">
                {" "}
                Total en el mes {totalDatos + totalDatosDos}{" "}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer max-md:shadow-lg max-md:hover:shadow-lg max-md:border-none">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 py-2 px-3 text-green-600">
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
            <strong className="block text-sm font-bold text-gray-500 max-md:text-xs uppercase">
              Total en metros cuadradados
            </strong>

            <p>
              <span className="text-3xl font-bold text-gray-900 max-md:text-base uppercase">
                {Number(
                  totalDatosMetrosCuadrados + totalDatosMetrosCuadradosLegales
                ).toFixed(2)}
              </span>

              <span className="text-xs text-gray-500 uppercase font-semibold">
                {" "}
                Total en el mes{" "}
                {Number(
                  totalDatosMetrosCuadrados + totalDatosMetrosCuadradosLegales
                ).toFixed(2)}{" "}
                mts{" "}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="py-0 px-4 max-md:hidden">
        <div className="pb-4">
          <p className="font-bold text-lg uppercase text-gray-600">
            Graficos del mes
          </p>
        </div>
        <div className="w-full grid grid-cols-2 gap-5">
          <div className="bg-white py-5 px-5 rounded-2xl">
            <ApexChart
              remuneraciones={remuneracionesMensuales}
              legales={legales}
            />
          </div>
          <div className="bg-white py-5 px-5 rounded-2xl">
            <ApexColumnChart
              totalFletesUsuario={totalFletesUsuario}
              totalViaticosUsuario={totalViaticosUsuario}
              totalRefuerzosUsuario={totalRefuerzosUsuario}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1  px-2 overflow-y-scroll h-[30vh] max-md:px-3 scroll-bar">
        <div className="hidden md:hidden max-md:block font-semibold text-sm uppercase text-slate-600 underline">
          <p> Progreso de las entregas</p>
        </div>

        <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total de la caja
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm font-bold ${
                totalCaja >= 0 ? "text-green-500" : "text-red-500"
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
                totalCaja >= 0 ? "bg-green-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalCaja / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>

        <RemuneracionesProgressBar
          rendicionesMensuales={rendicionesMensuales}
          remuneracionesMensuales={remuneracionesMensuales}
        />
        <SalidasProgressBar salidasMensuales={salidasMensuales} />
        <ViviendasProgressBar
          salidasMensuales={remuneracionesMensuales}
          legales={legales}
        />

        <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total en fletes
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
            >
              -{" "}
              {Number(totalFletesUsuario).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalFletesUsuario >= 0 ? "bg-red-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalFletesUsuario / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total en viaticos
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
            >
              -{" "}
              {Number(totalViaticosUsuario).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalViaticosUsuario >= 0 ? "bg-red-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalViaticosUsuario / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
            <p className="text-lg mb-3 uppercase max-md:text-sm font-semibold">
              Total en refuerzos
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm text-slate-700 font-bold`}
            >
              -{" "}
              {Number(totalRefuerzosUsuario).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
            <div
              className={`h-3 ${
                totalRefuerzosUsuario >= 0 ? "bg-red-400" : "bg-red-400"
              } max-md:h-2`}
              style={{
                width: `${Math.abs(totalRefuerzosUsuario / 1000000)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
