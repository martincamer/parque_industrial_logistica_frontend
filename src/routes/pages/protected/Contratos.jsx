import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImprimirPdfContratos } from "../../../components/pdf/ImprimirPdfContratos";

export const Contratos = () => {
  const { salidas } = useSalidasContext();
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

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

  return (
    <section className="min-h-screen max-h-full w-full h-full max-w-full max-md:py-12">
      <div className="bg-white mb-4 h-10 flex max-md:hidden">
        <Link
          to={"/"}
          className="bg-blue-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/contratos"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Contratos
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6 max-md:my-5">
        <p className="font-bold text-blue-500 text-xl">
          Observa tus contratos en esta sección.
        </p>
      </div>

      <div className="bg-white py-5 px-5 mx-5 grid grid-cols-5 max-md:grid-cols-1">
        <div className="bg-white py-5 px-5 border border-blue-500">
          <p className="font-medium text-blue-500">Total en contratos</p>
          <p className="font-bold text-lg">{totalContratosEnSalidas}</p>
        </div>
      </div>

      <div className="flex gap-2 items-center w-auto max-md:w-auto max-md:flex-col my-5 mx-5 bg-white py-5 px-5 max-md:items-start">
        <div className="bg-white py-2 px-3 text-sm font-bold w-1/3 border border-blue-500 cursor-pointer flex items-center max-md:w-full">
          <input
            type="text"
            value={searchTermCliente}
            onChange={handleSearchClienteChange}
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Buscar por cliente, localidad o número de contrato"
          />
          <FaSearch className="text-blue-500" />
        </div>
        <div className="bg-white py-2 px-3 text-sm  max-md:w-full font-bold w-auto border border-blue-500 cursor-pointer">
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="outline-none text-slate-600 bg-white w-full uppercase"
          >
            <option className="uppercase font-bold text-orange-400" value="">
              Seleccionar usuario...
            </option>
            {uniqueUsers.map((user) => (
              <option
                className="uppercase font-semibold"
                key={user}
                value={user}
              >
                {user}
              </option>
            ))}
            {/* Aquí puedes mapear tus opciones de usuarios únicos */}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
            <input
              type="date"
              value={fechaInicio}
              onChange={handleFechaInicioChange}
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha de inicio"
            />
          </div>
          <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
            <input
              type="date"
              value={fechaFin}
              onChange={handleFechaFinChange}
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Fecha fin"
            />
          </div>
        </div>
        <div className="">
          <PDFDownloadLink
            document={<ImprimirPdfContratos datos={filteredSalidas} />}
            className="bg-blue-500 py-1.5 max-md:mt-2 max-md:w- px-2 text-sm font-semibold text-white rounded hover:shadow transition-all"
          >
            Descargar contratos filtrados
          </PDFDownloadLink>
        </div>
      </div>

      <div className="bg-white mx-5 my-5 max-md:overflow-x-auto max-md:overflow-y-auto">
        <table className="w-full divide-y-2 divide-gray-200 text-xs table">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-4 text-slate-800 font-bold uppercase">
                Número
              </th>
              <th className="px-4 py-4 text-slate-800 font-bold uppercase">
                Cliente
              </th>
              <th className="px-4 py-4 text-slate-800 font-bold uppercase">
                Localidad/Prov.
              </th>
              <th className="px-4 py-4 text-slate-800 font-bold uppercase">
                Número de Contrato
              </th>
              <th className="px-4 py-4 text-slate-800 font-bold uppercase">
                Fecha de salida
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 uppercase">
            {filteredSalidas.map((salida) =>
              salida.datos_cliente.datosCliente.map((cliente, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {salida.id}
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-500 uppercase">
                    {cliente.cliente}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {cliente.localidad}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {cliente.numeroContrato}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {formatearFecha(salida.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* <PDFViewer className="h-screen w-full">
        <ImprimirPdfContratos datos={filteredSalidas} />
      </PDFViewer> */}
    </section>
  );
};
