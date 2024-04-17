import { useEffect, useState } from "react";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { useSalidasContext } from "../../../context/SalidasProvider";
import RemuneracionesColumnChart from "../../../components/charts/RemuneracionesColumnChart";
import RemuneracionesDonutChart from "../../../components/charts/RemuneracionesDonuts";
import RemuneracionesProgressBar from "../../../components/charts/RemuneracionesProgressBar";
import SalidasProgressBar from "../../../components/charts/SalidasProgressBar";
import ViviendasDataCharts from "../../../components/charts/ViviendasDataCharts";
import ViviendasProgressBar from "../../../components/charts/ViviendasProgressBar";
import RendicionesColumnChart from "../../../components/charts/RendicionesColumnChart";

export const Home = () => {
  const { salidasMensuales } = useSalidasContext();
  const { remuneracionesMensuales, remuneraciones } = useRemuneracionContext();
  const { rendicionesMensuales, rendiciones } = useRendicionesContext();
  const { legales, legalesReal } = useLegalesContext();

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

  return isLoading ? (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-20 max-md:gap-8 py-24 max-md:mb-10">
      {/* Artículo 1 */}
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0 uppercase">
        {/* Renderizar 5 artículos */}
        {Array.from({ length: 5 }).map((_, index) => (
          <article className="animate-pulse items-start flex gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer py-10s px-5">
            <div className="bg-slate-200 py-12 px-4 rounded-xl w-full"></div>
            <div className="bg-slate-200 py-5 px-10 rounded-xl"></div>
          </article>
        ))}
      </div>

      {/* Gráficos */}
      <div className="bg-white h-full w-full grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <article className="animate-pulse py-10 px-6 border-slate-200 border-[1px] rounded-2xl">
            <div className="bg-slate-200 py-2 px-2 rounded-full w-full"></div>
          </article>
        ))}
        {/* Gráfico de Remuneraciones */}
      </div>

      <div className="bg-white h-full w-full animate-pulse py-10 px-6 border-slate-200 border-[1px] rounded-2xl">
        <div className="bg-slate-200 py-2 rounded-xl w-full h-[50vh]"></div>
      </div>

      <div className="bg-white h-full w-full animate-pulse py-10 px-6 border-slate-200 border-[1px] rounded-2xl">
        <div className="bg-slate-200 py-2 rounded-xl w-full h-[50vh]"></div>
      </div>

      <div className="grid grid-cols-2 gap-5 items-start">
        <div className="bg-white h-full w-full animate-pulse py-10 px-6 border-slate-200 border-[1px] rounded-2xl">
          <div className="bg-slate-200 py-2 rounded-xl w-full h-[30vh]"></div>
        </div>
        <div className="bg-white w-full animate-pulse py-10 px-6 border-slate-200 border-[1px] rounded-2xl">
          <div className="bg-slate-200 py-2 rounded-xl w-full h-[10vh]"></div>
        </div>
      </div>

      {/* Otros gráficos y datos... */}
    </section>
  ) : (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-20 max-md:gap-8 py-24 max-md:mb-10">
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0 uppercase">
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-400 hover:shadow-md transition-all ease-linear bg-gray-100  p-3 max-md:rounded-xl cursor-pointer">
          <div
            className={`inline-flex gap-2 self-end rounded   ${
              totalCobroClienteDos +
                totalCobroRendicionesDos +
                totalCobroClienteLegalesDos / 100000 <
              0
                ? "bg-red-100 p-1 text-red-600"
                : totalCobroClienteDos +
                    totalCobroRendicionesDos +
                    totalCobroClienteLegalesDos / 100000 >
                  0
                ? "text-green-600 bg-green-100"
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
                totalCobroClienteDos +
                  totalCobroRendicionesDos +
                  totalCobroClienteLegalesDos / 100000 <
                0
                  ? "text-red-500"
                  : totalCobroClienteDos +
                      totalCobroRendicionesDos +
                      totalCobroClienteLegalesDos / 100000 >
                    0
                  ? "text-green-500"
                  : ""
              }`}
            >
              {(
                Number(
                  totalCobroClienteDos +
                    totalCobroRendicionesDos +
                    totalCobroClienteLegalesDos
                ) / 100000
              ).toFixed(2)}{" "}
              %
            </span>
          </div>

          <div>
            <div className="flex">
              <strong className="block text-sm font-medium text-slate-800 bg-white shadow py-2 px-4 rounded-xl max-md:text-xs uppercase">
                Total final de la caja
              </strong>
            </div>
            <div className="bg-white py-2 px-2 rounded-xl mt-2 shadow">
              <p className="text-slate-500">
                <span
                  className={`text-2xl max-md:text-base font-medium uppercase ${totalClassDos}`}
                >
                  {totalCobroDos.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}{" "}
                </span>
                <span
                  className={`text-xs
                 `}
                >
                  Total final de la caja {"  "}
                  {Number(
                    Number(totalCobroClienteDos + totalCobroRendicionesDos) +
                      Number(totalCobroClienteLegalesDos) || 0
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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
                Number(totalCobroCliente + totalCobroRendiciones) / 100000
              ).toFixed(2)}{" "}
              %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en remuneración del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-medium text-slate-900">
                {Number(
                  Number(totalCobroCliente + totalCobroRendiciones)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span
                className={`text-xs uppercase
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(Number(totalCobroClienteLegales) / 100000).toFixed(
                2
              )} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en legales del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-medium text-red-500 uppercase">
                {Number(totalCobroClienteLegales).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span
                className={`text-xs uppercase
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
          <div
            className={`inline-flex gap-2 self-end rounded   ${
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
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en remuraciones final con descuentos de legales del mes.
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium">
              {" "}
              {Number(totalGastosCliente / 100000).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en salidas registradas del mes
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-medium text-red-500 uppercase">
                {Number(totalGastosCliente).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>

              <span className="text-xs text-gray-500 uppercase">
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base uppercase">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalDatos + totalDatosDos / 10000).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total viviendas entregadas
            </strong>

            <p>
              <span className="text-3xl max-md:text-base font-medium text-gray-900">
                {totalDatos + totalDatosDos}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                Total en el mes {totalDatos + totalDatosDos}{" "}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en metros cuadradados
            </strong>

            <p>
              <span className="text-3xl font-medium text-gray-900 max-md:text-base uppercase">
                {Number(
                  totalDatosMetrosCuadrados + totalDatosMetrosCuadradosLegales
                ).toFixed(2)}
              </span>

              <span className="text-xs text-gray-500 uppercase">
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

      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
        <div className="hidden md:hidden max-md:block font-semibold text-sm uppercase text-slate-600 underline">
          <p> Progreso de las entregas</p>
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
            <p className="text-lg mb-3 uppercase max-md:text-sm">
              Total de la caja
            </p>
            <p
              className={`text-lg mb-3 max-md:text-sm ${
                totalCaja >= 0 ? "text-green-700" : "text-red-700"
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
      </div>

      <div className="bg-white h-full w-full">
        <div className="border-slate-200 border-[1px] rounded-2xl hover:shadow-md cursor-pointer py-10 max-md:py-5 px-5 max-md:px-2 flex flex-col items-center w-full transition-all ease-linear">
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
        <div className="border-slate-200 border-[1px] rounded-xl hover:shadow-md transition-all ease-linear cursor-pointer py-10 max-md:py-5 px-5 max-md:px-2 flex flex-col items-center w-full ">
          <div className="font-bold text-slate-700 mb-16 max-md:text-sm">
            GRAFICO DE RENDICIONES
          </div>
          <RendicionesColumnChart rendicionesMensuales={rendicionesMensuales} />
        </div>
      </div>

      <div className="w-full grid-cols-2 grid gap-3 items-start justify-center max-md:grid-cols-1">
        <div className="border-slate-200 border-[1px] rounded-2xl hover:shadow-md transition-all ease-linear py-10 px-5 flex flex-col items-center max-md:py-5">
          <div className="font-bold text-slate-700 mb-16 max-md:text-sm">
            DONUT REMUNERACIONES
          </div>
          <RemuneracionesDonutChart remuneraciones={remuneracionesMensuales} />
        </div>
        <ViviendasDataCharts salidasMensuales={salidasMensuales} />
      </div>
    </section>
  );
};
