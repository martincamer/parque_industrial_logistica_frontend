import React, { useState } from "react";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirPdfContratos } from "../../../components/pdf/ImprimirPdfContratos";
import { useAuth } from "../../../context/AuthProvider";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { FaFilePdf } from "react-icons/fa6";

export const Contratos = () => {
  const { salidas } = useSalidasContext();
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const { remuneraciones } = useRemuneracionContext();
  const { legalesReal } = useLegalesContext();

  const combinedData = [...remuneraciones, ...legalesReal];

  const { user } = useAuth();

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(
      combinedData.map((remuneracion) => remuneracion.usuario.toLowerCase())
    )
  );

  // Función para filtrar por término de búsqueda y usuario seleccionado
  const filteredSalidas = combinedData.filter((salida) => {
    // Filtrar por término de búsqueda en datosCliente
    const matchesSearchTerm = salida.datos_cliente.datosCliente.some(
      (cliente) =>
        cliente.cliente
          .toLowerCase()
          .includes(searchTermCliente.toLowerCase()) ||
        cliente.localidad
          .toLowerCase()
          .includes(searchTermCliente.toLowerCase()) ||
        cliente.numeroContrato
          .toLowerCase()
          .includes(searchTermCliente.toLowerCase())
    );

    // Filtrar por usuario seleccionado
    const matchesUser =
      selectedUser === "" ||
      salida.usuario.toLowerCase() === selectedUser.toLowerCase();

    // Filtrar por rango de fechas
    const matchesDate =
      (!fechaInicio ||
        new Date(salida.fecha_entrega) >= new Date(fechaInicio)) &&
      (!fechaFin || new Date(salida.fecha_entrega) <= new Date(fechaFin));

    return matchesSearchTerm && matchesUser && matchesDate;
  });

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  const totalContratosEnSalidas = filteredSalidas?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCudradosSalidas = filteredSalidas?.reduce(
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
  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent ">
          Sector de contratos ya entregados.
        </p>
      </div>

      <div className="px-5 pt-10 grid grid-cols-4 gap-2 max-md:grid-cols-1">
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-blue-200 to-primary bg-clip-text text-transparent">
              Total en contratos entregados.
            </p>
            <p className="text-white font-medium text-xl">
              {totalContratosEnSalidas}
            </p>
          </div>
        </div>
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-green-400 to-yellow-500 bg-clip-text text-transparent">
              Total metros cuadrados entregados.
            </p>
            <p className="text-white font-medium text-xl">
              {Number(totalDatosMetrosCudradosSalidas).toFixed(2)} mtrs
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center w-auto max-md:w-auto max-md:flex-col my-5 mx-5 max-md:mx-0 bg-white py-5 px-5 max-md:pb-0">
        <div className="flex gap-2 max-md:items-stretch max-md:flex-col max-md:w-full">
          <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md">
            <input
              value={searchTermCliente}
              onChange={handleSearchClienteChange}
              type="text"
              className="outline-none font-medium w-full"
              placeholder="Buscar por el cliente.."
            />
            <FaSearch className="text-gray-700" />
          </div>

          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
          >
            <option className="font-bold capitalize text-primary" value="">
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
        </div>
        <div className="flex gap-3 max-md:items-stretch max-md:w-full">
          <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold ">
            <input
              value={fechaInicio}
              onChange={handleFechaInicioChange}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm bg-white"
              placeholder="Fecha de inicio"
            />
          </div>
          <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
            <input
              value={fechaFin}
              onChange={handleFechaFinChange}
              type="date"
              className="outline-none text-slate-600 w-full max-md:text-sm bg-white"
              placeholder="Fecha fin"
            />
          </div>
        </div>
        <div className="max-md:hidden">
          <PDFDownloadLink
            document={<ImprimirPdfContratos datos={filteredSalidas} />}
            className="bg-gradient-to-r from-primary to-indigo-600 py-2 px-4 rounded-md text-white font-semibold text-sm outline-none flex gap-2 items-center"
          >
            Descargar contratos filtrados <FaFilePdf className="text-xl" />
          </PDFDownloadLink>
        </div>
      </div>

      <div className="max-md:overflow-x-auto px-5 pb-10 max-md:mx-5">
        <table className="table bg-gray-200 rounded-t-xl">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th>Número</th>
              <th>Fabrica de salida</th>
              <th>Contrato cliente</th>
              <th>Localidad y prov del cliente</th>
              <th>Fecha de entrega</th>
            </tr>
          </thead>

          <tbody className="text-xs font-medium capitalize bg-white ">
            {filteredSalidas
              .sort((a, b) => b.id - a.id) // Ordenar de mayor a menor por id
              .filter((salida) => user.localidad === salida.localidad)
              .map((salida) =>
                salida.datos_cliente.datosCliente.map((cliente, index) => (
                  <tr
                    className="hover:bg-gray-100/40 transition-all cursor-pointer"
                    key={index}
                  >
                    <td className="">{salida.id}</td>
                    <td className="">{salida.sucursal}</td>
                    <td className="text-blue-500 font-bold">
                      {cliente.cliente} ({cliente.numeroContrato})
                    </td>
                    <td className="">{cliente.localidad}</td>
                    <td>
                      <div className="flex">
                        <p>
                          {salida.fecha_entrega === "" ? (
                            <p className="font-bold text-red-500 bg-red-100 px-2 rounded-md py-1 text-center">
                              No hay una fecha ahún
                            </p>
                          ) : (
                            formatearFecha(salida.fecha_entrega)
                          )}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
