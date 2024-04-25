import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaOrdenLegal } from "../../../api/ingresos";

export const ResumenViewLegales = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaOrdenLegal(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

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

  const totalSuma = unicaSalida?.datos_cliente?.datosCliente.reduce(
    (acumulador, elemento) => {
      // Convertir la propiedad totalFlete a número y sumarla al acumulador
      return acumulador + parseFloat(elemento.totalFlete);
    },
    0
  ); // Iniciar el acumulador en 0

  const total =
    Number(unicaSalida.refuerzo) +
    Number(unicaSalida.viaticos) +
    Number(unicaSalida.pago_fletero_espera) +
    Number(totalSuma);
  const refuerzoPercentage = (
    (Number(unicaSalida.refuerzo) / total) *
    100
  ).toFixed(2);
  const recaudacionPercentage = (
    (Number(unicaSalida.recaudacion) / total) *
    100
  ).toFixed(2);
  const viaticosPercentage = (
    (Number(unicaSalida.viaticos) / total) *
    100
  ).toFixed(2);
  const totalFleteEsperaPercentage = (
    (Number(unicaSalida.pago_fletero_espera) / Number(total)) *
    100
  ).toFixed(2);

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 bg-gray-100/50 min-h-screen max-h-full">
      <div className="uppercase grid grid-cols-4 gap-3 max-md:border-none max-md:py-0 max-md:px-0 max-md:shadow-none max-md:grid-cols-1">
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-300 hover:shadow bg-white p-6 transition-all ease-linear">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium 
    ${
      unicaSalida.recaudacion >= 0
        ? "bg-red-100 text-red-600"
        : "bg-red-100 text-red-600"
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

            <span>{Number(unicaSalida.recaudacion / 100000).toFixed(2)}%</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total legales en esta entrega
            </strong>

            <p>
              <span
                className={`text-2xl font-medium max-md:text-base ${
                  unicaSalida.recaudacion >= 0 ? "text-red-500" : "text-red-500"
                }`}
              >
                {" "}
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span className="text-xs text-gray-500">
                el total es de{" "}
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}{" "}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-300 hover:shadow bg-white p-6 transition-all ease-linear">
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

            <span className="text-xs font-medium">MARZO</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-300 hover:shadow bg-white p-6 transition-all ease-linear">
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
              {/* {salidasMensuales.length / 10000} %{" "} */}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total de viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {unicaSalida.datos_cliente?.datosCliente?.length}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total final de entregadas{" "}
                <span className="font-bold text-slate-700">
                  {unicaSalida.datos_cliente?.datosCliente?.length}
                </span>
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="text-sm uppercase grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:py-0 max-md:px-0 max-md:shadow-none max-md:border-none">
        <div className="bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-2xl">
          <p className="text-slate-700 font-bold text-lg underline">
            Datos de los clientes
          </p>
          <div className="py-2 px-2 flex flex-col gap-3">
            {unicaSalida?.datos_cliente?.datosCliente?.map((datos, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 bg-white border-slate-200 border-[1px] rounded-xl py-2 px-2 shadow"
              >
                <div>
                  <p className="text-slate-600">
                    Nombre y Apellido:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.cliente} ({datos.numeroContrato})
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">
                    Localidad / Entregas:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.localidad}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">
                    Metros Cuadrados:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.metrosCuadrados} mts
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">
                    Total Flete:{" "}
                    <span className="text-slate-700 font-semibold">
                      {Number(datos.totalFlete).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-2xl">
          <p className="text-slate-700 font-bold text-lg underline">
            Datos de carga/fletero/etc
          </p>
          <div className="py-2 px-2 flex flex-col gap-3 mt-2">
            <div>
              <p className="text-slate-600">
                Nombre del armador:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.armador}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600">
                Nombre del chofer:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.chofer}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600">
                Total de km:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.km_lineal} klms
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600">
                Fecha de carga:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida?.fecha_carga?.split("T")[0]}
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-600">
                Fecha de entrega:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida?.fecha_entrega?.split("T")[0]}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-2xl flex flex-col gap-2">
          <p className="text-slate-700 font-bold text-lg underline">
            Remuneraciones/Etc
          </p>

          <div className="mt-3">
            <p className="text-slate-600">
              Pago chofer por espera:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.pago_fletero_espera).toLocaleString(
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

          <div className="">
            <p className="text-slate-600">
              Refuerzo:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.refuerzo).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600">
              Viaticos:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.viaticos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600">
              Auto:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.auto).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600">
              Total Flete:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(totalSuma).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600">
              Recaudacion:{" "}
              <span className="text-red-600 font-bold">
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      <article className="max-md:grid-cols-1 grid grid-cols-3 gap-4 items-start">
        <div className="flex gap-3">
          <div
            className={`bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-xl w-full relative ${
              Number(unicaSalida.recaudacion) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-slate-500 text-lg flex gap-2">
                {Number(
                  Number(unicaSalida.viaticos) +
                    Number(totalSuma) +
                    Number(unicaSalida.refuerzo) +
                    Number(unicaSalida.pago_fletero_espera)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
                <span className="font-bold text-slate-700">
                  °{" "}
                  {Number(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) / 100000
                  ).toFixed(2)}{" "}
                  %{" "}
                </span>
              </p>
              <p
                className={`font-semibold text-lg ${
                  Number(unicaSalida.recaudacion) >= 0
                    ? "text-red-600"
                    : "text-red-600"
                }`}
              >
                {Number(Number(unicaSalida.recaudacion)).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </p>
            </div>
            <div className="h-3 bg-gray-200 mt-3 rounded-md overflow-hidden">
              <div
                className={`h-full ${
                  Number(unicaSalida.recaudacion) >= 0
                    ? "bg-red-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.abs(
                    Number(unicaSalida.recaudacion) / 100
                  ).toFixed(2)}%`,
                }}
              ></div>
            </div>
            <span className="font-bold text-slate-500 text-sm">
              Recuadación
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-xl w-full relative">
            <div className="flex justify-between items-center">
              <p className="text-slate-500 text-lg flex gap-2">
                {Number(
                  Number(unicaSalida.viaticos) +
                    Number(totalSuma) +
                    Number(unicaSalida.refuerzo) +
                    Number(unicaSalida.pago_fletero_espera)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
                <span className="font-bold text-slate-700">
                  °{" "}
                  {Number(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) / 100000
                  ).toFixed(2)}{" "}
                  %
                </span>
              </p>
              {/* <p className="text-slate-500 text-lg">
                {Number(Number(unicaSalida.recaudacion)).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </p> */}
            </div>
            <div className="h-3 bg-gray-200 mt-3 rounded-md overflow-hidden">
              <div
                className="h-full bg-red-600"
                style={{
                  width: `${(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) /
                    100 /
                    100
                  ).toFixed(2)}%`,
                }}
              ></div>
            </div>
            <span className="font-bold text-slate-500 text-sm">
              Total gastos
            </span>
          </div>
        </div>
      </article>
    </section>
  );
};
