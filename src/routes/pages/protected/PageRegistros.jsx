import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useState } from "react";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import { IoIosArrowDown } from "react-icons/io";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImprimirContable } from "../../../components/pdf/ImprimirContable";
import { useAuth } from "../../../context/AuthProvider";
import { FaFilePdf } from "react-icons/fa6";

export const PageRegistros = () => {
  const { remuneraciones } = useRemuneracionContext();
  const { legalesReal } = useLegalesContext();

  const combinedData = [...remuneraciones, ...legalesReal];

  const { user } = useAuth();

  // Obtener el mes y año actuales
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = currentDate.getFullYear().toString();
  const currentMonthYear = `${currentYear}-${currentMonth}`;

  const [selectedFilter, setSelectedFilter] = useState("mes");
  const [selectedValue, setSelectedValue] = useState(currentMonthYear);
  const [selectedFactory, setSelectedFactory] = useState(""); // Nuevo estado para la fábrica

  // Obtener lista de fábricas (suponiendo que las fábricas se encuentran en los datos)
  const factories = [...new Set(combinedData.map((item) => item.sucursal))];

  const startOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];
  const startOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  )
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(startOfCurrentMonth);
  const [endDate, setEndDate] = useState(startOfNextMonth);

  function getWeek(fecha) {
    // Crear una nueva fecha del primer día del año
    const firstDayOfYear = new Date(fecha.getFullYear(), 0, 1);

    // Obtener la diferencia en milisegundos entre la fecha actual y el primer día del año
    const pastDaysOfYear =
      (fecha -
        firstDayOfYear +
        (firstDayOfYear.getTimezoneOffset() - fecha.getTimezoneOffset()) *
          60000) /
      86400000;

    // Calcular el número de la semana
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Filtrar los datos
  const filteredData = combinedData.filter((item) => {
    const fecha = new Date(item?.fecha_entrega);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;

    const filterByDate =
      (selectedFilter === "mes" &&
        year === Number(selectedValue.split("-")[0]) &&
        month === Number(selectedValue.split("-")[1])) ||
      (selectedFilter === "trimestre" &&
        year === Number(selectedValue) &&
        getTrimester(month) === Number(selectedValue.slice(-1))) ||
      (selectedFilter === "semana" &&
        year === Number(selectedValue.split("-")[0]) &&
        getWeek(fecha) === Number(selectedValue.split("-")[1])) ||
      (selectedFilter === "dia" &&
        fecha.toDateString() === new Date(selectedValue).toDateString()) ||
      (selectedFilter === "anio" && year === Number(selectedValue)) ||
      (selectedFilter === "rango-fechas" &&
        new Date(startDate) <= fecha &&
        fecha <= new Date(endDate));

    const filterByFactory = selectedFactory
      ? item.sucursal === selectedFactory
      : true;

    const filterByLocalidad = item.localidad === user.localidad;

    return filterByDate && filterByFactory && filterByLocalidad;
  });

  // Ordenar filteredData de menor a mayor por fecha_entrega
  const sortedFilteredData = filteredData.sort((a, b) => {
    return new Date(a.fecha_entrega) - new Date(b.fecha_entrega);
  });

  // Agrupar los datos por fecha de carga
  const groupedData = sortedFilteredData.reduce((acc, item) => {
    const fecha = new Date(item?.fecha_entrega).toLocaleDateString();
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(item);
    return acc;
  }, {});

  // Calcular los totales generales (suma de fletes completos de todos los clientes)
  const totalFletes = sortedFilteredData.reduce((acc, item) => {
    const totalFletePorItem = item.datos_cliente.datosCliente.reduce(
      (subAcc, cliente) => subAcc + Number(cliente.totalFlete),
      0
    );
    return acc + totalFletePorItem;
  }, 0);

  const totalFleteroEspera = sortedFilteredData.reduce(
    (acc, item) => acc + Number(item.pago_fletero_espera),
    0
  );

  const totalViaticos = sortedFilteredData.reduce(
    (acc, item) => acc + Number(item.viaticos),
    0
  );

  const totalRefuerzos = sortedFilteredData.reduce(
    (acc, item) => acc + Number(item.refuerzo),
    0
  );

  const totalRecaudacion = sortedFilteredData.reduce(
    (acc, item) => acc + Number(item.recaudacion),
    0
  );

  // Calcular los totales generales (suma de fletes completos de todos los clientes)
  const totalMetrosCuadrados = sortedFilteredData.reduce((acc, item) => {
    const totalFletePorItem = item.datos_cliente.datosCliente.reduce(
      (subAcc, cliente) => subAcc + Number(cliente.metrosCuadrados),
      0
    );
    return acc + totalFletePorItem;
  }, 0);

  const allClientes = sortedFilteredData?.flatMap(
    (salida) => salida?.datos_cliente?.datosCliente || []
  );

  return (
    <section>
      <div className="bg-gradient-to-tl from-gray-100 to-blue-50 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Filtrar informes</p>
      </div>

      <article className="flex gap-2">
        <div className="px-5 py-5 w-1/3 border mx-10 my-5 border-gray-300">
          <p className="font-bold border-b border-gray-500">Filtro por</p>

          <div className="mt-2">
            {/* Filtro por tipo: Mes, Trimestre, Semana, Día, Año */}
            <select
              className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="mes">Mes y Año</option>
              <option value="trimestre">Trimestre</option>
              <option value="semana">Semana</option>
              <option value="dia">Día</option>
              <option value="anio">Año</option>
              <option value="rango-fechas">Rango de Fechas</option>
            </select>

            {/* Filtro de valores (mes/año, trimestre, semana, día, año) */}
            <div className="mt-2">
              {selectedFilter === "mes" && (
                <select
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, index) => {
                    const month = (index + 1).toString().padStart(2, "0"); // Mes en formato MM
                    const monthNames = [
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
                    return (
                      <option key={month} value={`${currentYear}-${month}`}>
                        {`${monthNames[index]} ${currentYear}`}
                      </option>
                    );
                  })}
                </select>
              )}

              {selectedFilter === "trimestre" && (
                <select
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  {Array.from({ length: 4 }, (_, index) => {
                    const trimestre = index + 1;
                    return (
                      <option
                        key={trimestre}
                        value={`${currentYear}-${trimestre}`}
                      >
                        {`${trimestre}er Trimestre ${currentYear}`}
                      </option>
                    );
                  })}
                </select>
              )}
              {selectedFilter === "semana" && (
                <input
                  type="week"
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
              )}
              {selectedFilter === "dia" && (
                <input
                  type="date"
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
              )}
              {selectedFilter === "anio" && (
                <select
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <option value="">Seleccionar el año</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              )}
              {selectedFilter === "rango-fechas" && (
                <div className="flex gap-2">
                  <label className="font-bold">Desde:</label>
                  <input
                    type="date"
                    className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <label className="font-bold">Hasta:</label>
                  <input
                    type="date"
                    className="border border-gray-300 py-1 px-4 rounded-md outline-none text-sm font-semibold"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 items-start">
            <label className="font-bold">Seleccionar Fábrica</label>
            <select
              className="border border-gray-300 py-1 px-4 rounded-md outline-none capitalize text-sm font-semibold"
              value={selectedFactory}
              onChange={(e) => setSelectedFactory(e.target.value)}
            >
              <option className="capitalize font-bold" value="">
                Todas las fábricas
              </option>
              {factories.map((factory) => (
                <option
                  className="capitalize font-bold"
                  key={factory}
                  value={factory}
                >
                  {factory}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-5 pt-5 flex items-start gap-2">
          <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
            <div className="flex flex-col gap-1 items-center">
              <p className="font-extrabold text-lg bg-gradient-to-l from-blue-200 to-primary bg-clip-text text-transparent">
                Total en contratos entregados.
              </p>
              <p className="text-white font-medium text-xl">
                {allClientes.length}
              </p>
            </div>
          </div>
          <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
            <div className="flex flex-col gap-1 items-center">
              <p className="font-extrabold text-lg bg-gradient-to-l from-green-400 to-yellow-500 bg-clip-text text-transparent">
                Total metros cuadrados entregados.
              </p>
              <p className="text-white font-medium text-xl">
                {Number(totalMetrosCuadrados).toFixed(2)} mtrs
              </p>
            </div>
          </div>
        </div>
        {/* <div className="my-5 flex flex-col gap-2">
          <div className=" border border-gray-300 px-5 py-5">
            <p className="font-bold uppercase">Total de metros cuadrados</p>
            <p className="font-bold text-primary">
              {Number(totalMetrosCuadrados).toFixed(2)} mtrs.
            </p>
          </div>
          <div className=" border border-gray-300 px-5 py-5">
            <p className="font-bold uppercase">Total de contratos</p>
            <p className="font-bold text-primary">{allClientes.length}.</p>
          </div>
        </div> */}
      </article>

      <div className="py-5 px-5 overflow-y-scroll h-[100vh] scroll-bar">
        {Object.keys(groupedData).map((fecha, index) => (
          <div key={index} className="mb-5">
            <div className="border-b-2 border-gray-400 pb-2 mb-4">
              <p className="font-bold text-sm uppercase">
                Fecha de entrega {fecha}
              </p>
            </div>

            {groupedData[fecha].map((item, idx) => (
              <div key={idx} className="mb-2 border-b border-gray-300">
                <div className="grid grid-cols-7 gap-4 text-sm font-medium uppercase ">
                  <div className="col-span-1">
                    <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
                      Contratos
                    </p>
                    {item.datos_cliente.datosCliente.map(
                      (cliente, clientIndex) => (
                        <p key={clientIndex} className="uppercase">
                          {cliente.cliente} ({cliente.numeroContrato})
                        </p>
                      )
                    )}
                  </div>
                  {/* <div className="col-span-1">
                    <p className="font-bold text-blue-500">Fecha</p>
                    <p>{new Date(item.fecha_entrega).toLocaleDateString()}</p>
                  </div> */}
                  <div className="col-span-1">
                    <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
                      Total Fletes
                    </p>
                    <p>
                      {item.datos_cliente.datosCliente.map(
                        (cliente, clientIndex) => (
                          <p key={clientIndex} className="uppercase">
                            {formatearDinero(cliente.totalFlete)}
                          </p>
                        )
                      )}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
                      Pago a Fletero + Espera
                    </p>
                    <p>{formatearDinero(Number(item.pago_fletero_espera))}</p>
                    {/* <p>
                      {item.datos_cliente.datosCliente.map(
                        (cliente, clientIndex) => (
                          <p key={clientIndex} className="uppercase">
                            {formatearDinero(cliente.totalFlete)}
                          </p>
                        )
                      )}
                    </p> */}
                  </div>
                  <div className="col-span-1">
                    <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
                      Viáticos
                    </p>
                    <p>{formatearDinero(Number(item.viaticos))}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
                      Refuerzos
                    </p>
                    <p>{formatearDinero(Number(item.refuerzo))}</p>
                  </div>
                  <div className="col-span-1">
                    {/* <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
                      Recaudación
                    </p> */}
                    <div className="flex mt-1">
                      <p
                        className={
                          Number(item.recaudacion) >= 0
                            ? "text-green-700 bg-green-100 py-1 px-2 rounded-md font-bold"
                            : "text-red-700 bg-red-100 py-1 px-2 rounded-md font-bold"
                        }
                      >
                        {formatearDinero(Number(item.recaudacion))}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <IoIosArrowDown
                      className="text-3xl cursor-pointer hover:bg-gray-800 py-1.5 px-1.5 hover:shadow-md rounded-md hover:text-white transition-all ease-linear"
                      onClick={() =>
                        document.getElementById("my_modal_datos").showModal()
                      }
                    />
                    <dialog id="my_modal_datos" className="modal">
                      <div className="modal-box rounded-md max-w-xl">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <div>
                          <p className="font-bold underline">
                            Datos del contrato
                          </p>
                          <div className="mt-2 flex flex-col gap-2 text-xs">
                            {item.datos_cliente.datosCliente.map(
                              (cliente, clientIndex) => (
                                <p
                                  key={clientIndex}
                                  className="text-black border-b border-gray-300 pb-1"
                                >
                                  <span className="font-bold">Contrato:</span>{" "}
                                  {cliente.cliente} ({cliente.numeroContrato})
                                </p>
                              )
                            )}
                            <p className="text-black border-b border-gray-300 pb-1">
                              <span className="font-bold">
                                Localidad y prov:
                              </span>{" "}
                              {item.datos_cliente.datosCliente[0].localidad}
                            </p>
                            <p className="text-black border-b border-gray-300 pb-1">
                              <span className="font-bold">
                                Metros cuadrados:
                              </span>{" "}
                              {Number(
                                item.datos_cliente.datosCliente[0]
                                  .metrosCuadrados
                              ).toFixed(2)}{" "}
                              mtrs.
                            </p>
                          </div>
                          <p className="font-bold underline mt-2">
                            Datos externos
                          </p>
                          <div className="mt-2 flex flex-col gap-2 text-xs">
                            <p className="text-black border-b border-gray-300 pb-1">
                              <span className="font-bold">
                                Chofer del viaje:
                              </span>{" "}
                              {item.chofer}
                            </p>
                            <p className="text-black border-b border-gray-300 pb-1">
                              <span className="font-bold">
                                Armador del viaje:
                              </span>{" "}
                              {item.armador}
                            </p>
                            <p className="text-black border-b border-gray-300 pb-1">
                              <span className="font-bold">
                                Fabrica/Sucursal de salida:
                              </span>{" "}
                              {item.sucursal}
                            </p>
                            <p className="text-black border-b border-gray-300 pb-1">
                              <span className="font-bold">
                                Total de kilometros:
                              </span>{" "}
                              {item.km_lineal} kms.
                            </p>
                          </div>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mostrar los totales generales */}
      <div className="py-5 px-5 border-t border-gray-400 mt-5">
        <h2 className="text-lg font-bold uppercase mb-2">Totales Generales</h2>
        <div className="grid grid-cols-5 gap-4 text-sm font-medium uppercase items-center">
          <div>
            <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
              Total Fletes
            </p>
            <p>{formatearDinero(totalFletes)}</p>
          </div>
          <div>
            <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
              Pago a Fletero + Espera
            </p>
            <p>{formatearDinero(totalFleteroEspera)}</p>
          </div>
          <div>
            <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
              Viáticos
            </p>
            <p>{formatearDinero(totalViaticos)}</p>
          </div>
          <div>
            <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
              Refuerzos
            </p>
            <p>{formatearDinero(totalRefuerzos)}</p>
          </div>
          <div>
            {/* <p className="font-extrabold text-sm bg-gradient-to-l from-blue-500 to-primary bg-clip-text text-transparent">
              Recaudación
            </p> */}
            <div className="flex text-xl">
              <p
                className={
                  Number(totalRecaudacion) >= 0
                    ? "text-green-700 bg-green-100 py-1 px-2 rounded-md font-bold"
                    : "text-red-700 bg-red-100 py-1 px-2 rounded-md font-bold"
                }
              >
                {formatearDinero(totalRecaudacion)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-10 flex">
        <PDFDownloadLink
          className="bg-gradient-to-r from-primary to-indigo-600 py-2 px-4 rounded-md text-white font-semibold text-sm outline-none flex gap-2 items-center"
          fileName={`DOCUMENTO CONTABLE TECNOHOUSE ${selectedValue}`}
          document={
            <ImprimirContable
              groupedData={groupedData}
              totalFleteroEspera={totalFleteroEspera}
              totalFletes={totalFletes}
              totalRecaudacion={totalRecaudacion}
              totalRefuerzos={totalRefuerzos}
              totalViaticos={totalViaticos}
              fecha={selectedValue}
              currentYear={currentYear}
              allClientes={allClientes}
              totalMetrosCuadrados={totalMetrosCuadrados}
            />
          }
        >
          Descargar contabilidad <FaFilePdf className="text-2xl" />
        </PDFDownloadLink>
      </div>
      {/* <PDFViewer className="w-full h-screen">
        <ImprimirContable
          groupedData={groupedData}
          totalFleteroEspera={totalFleteroEspera}
          totalFletes={totalFletes}
          totalRecaudacion={totalRecaudacion}
          totalRefuerzos={totalRefuerzos}
          totalViaticos={totalViaticos}
          fecha={selectedValue}
          currentYear={currentYear}
          allClientes={allClientes}
          totalMetrosCuadrados={totalMetrosCuadrados}
        />
      </PDFViewer> */}
    </section>
  );
};
