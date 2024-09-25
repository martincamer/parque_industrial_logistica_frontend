import React, { useState } from "react";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirPdfContratos } from "../../../components/pdf/ImprimirPdfContratos";
import { useAuth } from "../../../context/AuthProvider";

export const Contratos = () => {
  const { salidas } = useSalidasContext();
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const { user } = useAuth();

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(salidas.map((remuneracion) => remuneracion.usuario.toLowerCase()))
  );

  // Función para filtrar por término de búsqueda y usuario seleccionado
  const filteredSalidas = salidas.filter((salida) => {
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
      (!fechaInicio || new Date(salida.created_at) >= new Date(fechaInicio)) &&
      (!fechaFin || new Date(salida.created_at) <= new Date(fechaFin));

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
        <p className="font-bold text-gray-900 text-xl">
          Sector de contratos ya entregados.
        </p>
      </div>

      <div className="bg-white py-5 px-5 mx-5 grid grid-cols-5 max-md:grid-cols-1 gap-2">
        <div className="bg-white py-5 px-5 border border-gray-300 rounded-md">
          <p className="font-medium text-black">Total en contratos</p>
          <p className="font-extrabold text-lg">{totalContratosEnSalidas}</p>
        </div>
        <div className="bg-white py-5 px-5 border border-gray-300 rounded-md">
          <p className="font-medium text-black">Total metros cuadrados</p>
          <p className="font-extrabold text-lg">
            {Number(totalDatosMetrosCudradosSalidas).toFixed(2)} mtrs
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center w-auto max-md:w-auto max-md:flex-col my-5 mx-5 bg-white py-5 px-5 max-md:items-start">
        <div className="flex gap-2">
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
        <div className="flex gap-3">
          <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
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
        <div className="">
          <PDFDownloadLink
            document={<ImprimirPdfContratos datos={filteredSalidas} />}
            className="bg-primary py-1.5 max-md:mt-2 max-md:w- px-2 text-sm font-semibold text-white rounded hover:shadow transition-all"
          >
            Descargar contratos filtrados
          </PDFDownloadLink>
        </div>
      </div>

      <div className="max-md:overflow-x-auto mx-10 max-md:mx-5">
        <table className="table">
          <thead className="text-gray-900 text-sm">
            <tr>
              <th>Número</th>
              <th>Fabrica de salida</th>
              <th>Contrato</th>
              <th>Localidad/Prov.</th>
              <th>Fecha de salida</th>
            </tr>
          </thead>

          <tbody className="text-xs uppercase font-medium">
            {filteredSalidas
              .sort((a, b) => b.id - a.id) // Ordenar de mayor a menor por id
              .filter((salida) => user.localidad === salida.localidad)
              .map((salida) =>
                salida.datos_cliente.datosCliente.map((cliente, index) => (
                  <tr key={index}>
                    <td className="">{salida.id}</td>
                    <td className="">{salida.fabrica}</td>
                    <td className="text-blue-500 font-bold">
                      {cliente.cliente} ({cliente.numeroContrato})
                    </td>
                    <td className="">{cliente.localidad}</td>
                    <td className="">{formatearFecha(salida.created_at)}</td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
