import { useParams } from "react-router-dom";
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
  }, [params.id]);

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

  return (
    <section className="w-full h-full min-h-screen max-w-full max-h-full">
      <div className="bg-gray-800 py-12 px-10 w-1/2 mx-auto rounded-b-2xl max-md:w-full">
        <div className="flex flex-col gap-5 max-md:text-center">
          <p className="font-bold text-white text-xl text-center">
            Orden legal obtenida, observa los datos.
          </p>
          <p className="text-white text-xl">
            Numero de la orden legal{" "}
            <span className="font-bold text-primary">{params.id}</span>{" "}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0 capitalize text-sm mx-5 my-10">
        <div className="bg-white border-gray-300 rounded-md border py-5 px-5">
          <p className="text-slate-700 font-bold text-sm max-md:text-sm max-md:capitalize">
            Datos de los clientes
          </p>
          <div className="py-2 px-2 flex flex-col gap-3 h-[200px] overflow-y-scroll scroll-bar">
            {unicaSalida?.datos_cliente?.datosCliente?.map((datos, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 bg-white border-gray-200 rounded-md border py-2 px-2"
              >
                <div>
                  <p className="text-slate-600 text-sm">
                    Nombre y Apellido:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.cliente} ({datos.numeroContrato})
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">
                    Localidad / Entregas:{" "}
                    <span className="text-slate-700 font-semibold ">
                      {datos.localidad}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">
                    Metros Cuadrados:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.metrosCuadrados} mts
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">
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

        <div className="bg-white border-gray-300 rounded-md border py-5 px-5">
          <p className="text-slate-700 font-bold text-sm max-md:capitalize">
            Datos de carga/fletero/etc
          </p>
          <div className="py-2 px-2 flex flex-col gap-3 mt-2">
            <div>
              <p className="text-slate-600 max-md:text-sm">
                Nombre del armador:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.armador}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600 max-md:text-sm">
                Nombre del chofer:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.chofer}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600 max-md:text-sm">
                Total de km:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.km_lineal} klms
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600 max-md:text-sm">
                Fecha de carga:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida?.fecha_carga?.split("T")[0]}
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-600 max-md:text-sm">
                Fecha de entrega:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida?.fecha_entrega?.split("T")[0]}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-gray-300 rounded-md border py-5 px-5">
          <p className="text-slate-700 font-bold text-sm underline max-md:text-sm max-md:capitalize">
            Perdidas/Etc
          </p>
          <div className="flex flex-col gap-2">
            <div className="mt-3">
              <p className="text-slate-600 max-md:text-sm">
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
              <p className="text-slate-600 max-md:text-sm">
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
              <p className="text-slate-600 max-md:text-sm">
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
              <p className="text-slate-600 max-md:text-sm">
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
              <p className="text-slate-600 max-md:text-sm">
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
              <p className="text-slate-600 max-md:text-sm">
                Total perdido:{" "}
                <span
                  className={
                    unicaSalida.recaudacion < 0
                      ? "text-red-600 font-bold"
                      : "text-gray-600 font-bold"
                  }
                >
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
      </div>
      <article className="grid grid-cols-3 gap-4 items-start max-md:grid-cols-1 mx-5">
        <div className="flex gap-3">
          <div
            className={`bg-white border-gray-300 rounded-md border hover:shadow py-5 px-5 w-full relative max-md:py-3 ${
              Number(unicaSalida.recaudacion) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <div className="flex justify-between items-center max-md:text-sm">
              <p className="text-slate-500 text-lg flex gap-2 max-md:text-sm">
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
                <span className="font-bold text-slate-700 max-md:text-sm">
                  ° {Number(unicaSalida.recaudacion / 100000).toFixed(2)} %{" "}
                </span>
              </p>
              <p
                className={`font-semibold text-lg max-md:text-sm ${
                  Number(unicaSalida.recaudacion) >= 0
                    ? "text-green-600"
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
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.abs(
                    Number(unicaSalida.recaudacion) / 10000
                  ).toFixed(2)}%`,
                }}
              ></div>
            </div>
            <span className="font-bold text-slate-500 text-sm">Perdida</span>
          </div>
        </div>

        <div className="flex gap-3 max-md:pb-10">
          <div className="bg-white border-gray-300 rounded-md border hover:shadow py-5 px-5 w-full relative max-md:py-2">
            <div className="flex justify-between items-center">
              <p className="text-slate-500 text-lg flex gap-2 max-md:text-sm">
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
                <span className="font-bold text-slate-700 max-md:text-sm">
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
            </div>
            <div className="h-3 bg-gray-200 mt-3 rounded-md overflow-hidden">
              <div
                className="h-full bg-red-600 max-md:text-sm"
                style={{
                  width: `${(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) / 100000
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
