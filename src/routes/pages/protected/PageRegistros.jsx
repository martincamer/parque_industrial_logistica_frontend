import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useState } from "react";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import * as XLSX from "xlsx";

export const PageRegistros = () => {
  const { remuneraciones } = useRemuneracionContext();
  const { legalesReal } = useLegalesContext();

  const combinedData = [...remuneraciones, ...legalesReal];

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

  // Función para filtrar datos según el filtro seleccionado
  const filteredData = combinedData.filter((item) => {
    const fecha = new Date(item?.fecha_carga);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;

    // Filtrado existente
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
      (selectedFilter === "anio" && year === Number(selectedValue));

    // Filtrar por fábrica si se seleccionó alguna
    const filterByFactory = selectedFactory
      ? item.sucursal === selectedFactory
      : true;

    return filterByDate && filterByFactory;
  });

  // Agrupar los datos por fecha de carga
  const groupedData = filteredData.reduce((acc, item) => {
    const fecha = new Date(item?.fecha_carga).toLocaleDateString();
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(item);
    return acc;
  }, {});

  // Calcular totales generales
  const totalFletes = filteredData.reduce(
    (acc, item) => acc + Number(item.datos_cliente.datosCliente[0].totalFlete),
    0
  );

  const totalFleteroEspera = filteredData.reduce(
    (acc, item) => acc + Number(item.pago_fletero_espera),
    0
  );

  const totalViaticos = filteredData.reduce(
    (acc, item) => acc + Number(item.viaticos),
    0
  );

  const totalRefuerzos = filteredData.reduce(
    (acc, item) => acc + Number(item.refuerzo),
    0
  );

  const totalRecaudacion = filteredData.reduce(
    (acc, item) => acc + Number(item.recaudacion),
    0
  );

  // Calcular totales generales
  const totalMetrosCuadrados = filteredData.reduce(
    (acc, item) =>
      acc + Number(item.datos_cliente.datosCliente[0].metrosCuadrados),
    0
  );

  const totalClientes = filteredData?.reduce((total, item) => {
    return (
      total +
      (item?.datos_cliente?.datosCliente
        ? Object.keys(item.datos_cliente.datosCliente).length
        : 0)
    );
  }, 0);

  const descargarExcel = () => {
    const excelData = [];

    // Agrupar los datos por fecha y luego por empleado
    filteredData.forEach((item) => {
      const fecha = new Date(item.fecha_carga).toLocaleDateString();
      const cliente = item.datos_cliente.datosCliente[0].cliente.toUpperCase();
      const totalFlete = Number(item.datos_cliente.datosCliente[0].totalFlete);
      const pagoFleteroEspera = Number(item.pago_fletero_espera);
      const viaticos = Number(item.viaticos);
      const refuerzo = Number(item.refuerzo);
      const recaudacion = Number(item.recaudacion);

      // Agregar la fila del cliente bajo la fecha
      excelData.push({
        FECHA: fecha,
        CLIENTE: cliente,
        "TOTAL EN FLETES": formatearDinero(totalFlete),
        "PAGO FLETERO + ESPERA": formatearDinero(pagoFleteroEspera),
        VIATICOS: formatearDinero(viaticos),
        REFUERZOS: formatearDinero(refuerzo),
        RECAUDACIÓN: formatearDinero(recaudacion),
      });
    });

    // Calcular los totales generales
    const totalFletes = filteredData.reduce(
      (acc, item) =>
        acc + Number(item.datos_cliente.datosCliente[0].totalFlete),
      0
    );

    const totalFleteroEspera = filteredData.reduce(
      (acc, item) => acc + Number(item.pago_fletero_espera),
      0
    );

    const totalViaticos = filteredData.reduce(
      (acc, item) => acc + Number(item.viaticos),
      0
    );

    const totalRefuerzos = filteredData.reduce(
      (acc, item) => acc + Number(item.refuerzo),
      0
    );

    const totalRecaudacion = filteredData.reduce(
      (acc, item) => acc + Number(item.recaudacion),
      0
    );

    // Agregar la fila de total general
    excelData.push({
      FECHA: "TOTAL GENERAL",
      CLIENTE: "",
      "TOTAL EN FLETES": formatearDinero(totalFletes),
      "TOTAL PAGO + ESPERA FLETERO": formatearDinero(totalFleteroEspera),
      "TOTAL VIATICOS": formatearDinero(totalViaticos),
      "TOTAL REFUERZOS": formatearDinero(totalRefuerzos),
      "TOTAL RECAUDADO": formatearDinero(totalRecaudacion),
    });

    // Crear el archivo Excel
    const ws = XLSX.utils.json_to_sheet(excelData, { skipHeader: false });

    const mergeCells = [
      // Fusionar las celdas de la fecha
      { s: { r: 0, c: 0 }, e: { r: filteredData.length - 1, c: 0 } }, // Por ejemplo, fusiona las celdas de fecha
    ];

    ws["!merges"] = mergeCells;

    // Crear el libro y agregar la hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Filtrados");

    // Descargar el archivo
    XLSX.writeFile(wb, "datos_filtrados.xlsx");
  };

  return (
    <section>
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Filtrar informes</p>
      </div>

      <article className="flex gap-2">
        <div className="px-10 py-10 w-1/4 border mx-10 my-5 border-gray-300">
          <p className="font-bold border-b border-gray-500">Filtro por</p>

          <div className="mt-2">
            {/* Filtro por tipo: Mes, Trimestre, Semana, Día, Año */}
            <select
              className="border border-gray-300 py-1 px-4 rounded-md outline-none"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="mes">Mes y Año</option>
              <option value="trimestre">Trimestre</option>
              <option value="semana">Semana</option>
              <option value="dia">Día</option>
              <option value="anio">Año</option>
            </select>

            {/* Filtro de valores (mes/año, trimestre, semana, día, año) */}
            <div className="mt-2">
              {selectedFilter === "mes" && (
                <select
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none"
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
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none"
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
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
              )}
              {selectedFilter === "dia" && (
                <input
                  type="date"
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
              )}
              {selectedFilter === "anio" && (
                <select
                  className="border border-gray-300 py-1 px-4 rounded-md outline-none"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              )}
            </div>
          </div>
          <div className="mt-2">
            <label className="font-bold">Seleccionar Fábrica</label>
            <select
              className="border border-gray-300 py-1 px-4 rounded-md outline-none capitalize"
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
        <div className="my-5 flex flex-col gap-2">
          <div className=" border border-gray-300 px-5 py-5">
            <p className="font-bold uppercase">Total de metros cuadrados</p>
            <p className="font-bold text-primary">
              {Number(totalMetrosCuadrados).toFixed(2)} mtrs.
            </p>
          </div>
          <div className=" border border-gray-300 px-5 py-5">
            <p className="font-bold uppercase">Total de contratos</p>
            <p className="font-bold text-primary">{totalClientes}.</p>
          </div>
          <div className="flex justify-end py-4 px-10">
            <button
              onClick={descargarExcel}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Descargar Excel
            </button>
          </div>
        </div>
      </article>

      <div className="py-5 px-5 overflow-y-scroll h-[100vh] scroll-bar">
        {Object.keys(groupedData).map((fecha, index) => (
          <div key={index} className="mb-5">
            <div className="border-b-2 border-gray-400 pb-2 mb-4">
              <p className="font-bold text-sm uppercase">
                Fecha de carga {fecha}
              </p>
            </div>

            {groupedData[fecha].map((item, idx) => (
              <div key={idx} className="mb-2 border-b border-gray-300">
                <div className="grid grid-cols-7 gap-4 text-sm font-medium uppercase">
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">Contrato</p>
                    <p className="uppercase">
                      {item.datos_cliente.datosCliente[0].cliente} (
                      {item.datos_cliente.datosCliente[0].numeroContrato})
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">Fecha</p>
                    <p>{new Date(item.fecha_carga).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">Total Fletes</p>
                    <p>
                      {formatearDinero(
                        item.datos_cliente.datosCliente[0].totalFlete
                      )}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">
                      Pago a Fletero + Espera
                    </p>
                    <p>{formatearDinero(Number(item.pago_fletero_espera))}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">Viáticos</p>
                    <p>{formatearDinero(Number(item.viaticos))}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">Refuerzos</p>
                    <p>{formatearDinero(Number(item.refuerzo))}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold text-blue-500">Recaudación</p>
                    <p
                      className={
                        Number(item.recaudacion) >= 0
                          ? "text-green-500 font-bold"
                          : "text-red-500 font-bold"
                      }
                    >
                      {formatearDinero(Number(item.recaudacion))}
                    </p>
                  </div>
                  {/* <div className="col-span-1">
                    <p className="font-bold text-blue-500">Fabrica</p>
                    <p className="uppercase">{item.sucursal}</p>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mostrar los totales generales */}
      <div className="py-5 px-5 border-t border-gray-400 mt-5">
        <h2 className="text-lg font-bold uppercase mb-2">Totales Generales</h2>
        <div className="grid grid-cols-5 gap-4 text-sm font-medium uppercase">
          <div>
            <p className="font-bold text-blue-500">Total Fletes</p>
            <p>{formatearDinero(totalFletes)}</p>
          </div>
          <div>
            <p className="font-bold text-blue-500">Pago a Fletero + Espera</p>
            <p>{formatearDinero(totalFleteroEspera)}</p>
          </div>
          <div>
            <p className="font-bold text-blue-500">Viáticos</p>
            <p>{formatearDinero(totalViaticos)}</p>
          </div>
          <div>
            <p className="font-bold text-blue-500">Refuerzos</p>
            <p>{formatearDinero(totalRefuerzos)}</p>
          </div>
          <div>
            <p className="font-bold text-blue-500">Recaudación</p>
            <p
              className={
                totalRecaudacion >= 0
                  ? "text-green-500 font-bold text-lg"
                  : "text-red-500 font-bold text-lg"
              }
            >
              {formatearDinero(totalRecaudacion)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
