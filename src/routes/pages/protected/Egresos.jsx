import { Link } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { FaArrowDown, FaDeleteLeft, FaHouseChimneyUser } from "react-icons/fa6";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useAuth } from "../../../context/AuthProvider";
import { useObtenerId } from "../../../helpers/obtenerId";
import { useForm } from "react-hook-form";
import { showSuccessToastError } from "../../../helpers/toast";
import { CgMenuLeftAlt } from "react-icons/cg";
import { useEgresosContext } from "../../../context/EgresosProvider";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import io from "socket.io-client";
import client from "../../../api/axios";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { toast } from "react-toastify";

export const Egresos = () => {
  const { egresos } = useEgresosContext();
  const { user } = useAuth();

  const { idObtenida, handleObtenerId } = useObtenerId();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(egresos.map((salida) => salida.usuario.toLowerCase()))
  );

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

  let filteredData = egresos;

  // Filtrar por rango de fechas
  if (fechaInicio && fechaFin) {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    filteredData = egresos.filter((item) => {
      const fechaOrden = new Date(item.created_at);
      return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
    });
  }

  // Ordenar por fecha de mayor a menor
  filteredData.sort((a, b) => {
    const fechaA = new Date(a.created_at);
    const fechaB = new Date(b.created_at);
    return fechaB - fechaA; // Ordena de mayor a menor (fecha más reciente primero)
  });

  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = egresos.filter((salida) => {
    const createdAtMonth = new Date(salida.created_at).getMonth() + 1;
    return createdAtMonth === currentMonth;
  });

  // Obtener la fecha actual
  const currentDate = new Date();

  // Obtener el número del día de la semana (0 para domingo, 1 para lunes, etc.)
  const currentDayOfWeek = currentDate.getDay();

  // Calcular la fecha del primer día de la semana (lunes)
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(
    currentDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)
  );

  // Calcular la fecha del último día de la semana (domingo)
  const lastDayOfWeek = new Date(currentDate);
  lastDayOfWeek.setDate(currentDate.getDate() - currentDayOfWeek + 7);

  // Filtrar las egresos por la semana actual
  const filteredByWeek = egresos.filter((salida) => {
    const createdAtDate = new Date(salida.created_at);
    return createdAtDate >= firstDayOfWeek && createdAtDate <= lastDayOfWeek;
  });

  const totalCobroEgresos = filteredData.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gradient-to-tl from-gray-100 to-blue-50 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Sector de egresos.</p>
        <button
          onClick={() =>
            document.getElementById("my_modal_nuevo_egreso").showModal()
          }
          type="button"
          className="bg-gradient-to-r from-primary to-indigo-600 py-1 px-4 rounded-md text-white font-semibold text-sm outline-none"
        >
          Cargar nuevo egreso
        </button>
      </div>

      <div className="px-5 pt-10 grid grid-cols-4 gap-2">
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-blue-200 to-primary bg-clip-text text-transparent">
              Total en egresos.
            </p>
            <p className="text-white font-medium text-xl">
              {formatearDinero(totalCobroEgresos)}
            </p>
          </div>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-green-400 to-yellow-500 bg-clip-text text-transparent">
              Total egresos cargados.
            </p>
            <p className="text-white font-medium text-xl">
              {filteredData.length}
            </p>
          </div>
        </div>{" "}
      </div>

      <div className="flex gap-3 mx-5 justify-between mt-10 mb-2 max-md:mt-3">
        <div className="flex items-center gap-3 max-md:flex-col">
          <div className="flex gap-2">
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
                className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
                placeholder="Fecha de inicio"
              />
            </div>
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
              <input
                value={fechaFin}
                onChange={handleFechaFinChange}
                type="date"
                className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
                placeholder="Fecha fin"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-md:overflow-x-auto mx-5 mt-10 scrollbar-hidden">
        <table className="table">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th className="">Numero</th>
              <th className="">Egreso total</th>
              <th className="">Observación</th>
              <th className="">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize font-medium">
            {filteredData
              .filter((s) => s.localidad === user.localidad) // Filtrar por localidad del usuario
              .map((s) => (
                <tr key={s.id}>
                  <td className="">{s.id}</td>
                  <td className="">
                    <div className="flex">
                      <p className="font-bold text-red-600 bg-red-50 py-2 px-4 rounded-md">
                        {formatearDinero(Number(s.recaudacion))}
                      </p>
                    </div>
                  </td>
                  <td className="">{s.observacion}</td>
                  <td className="max-md:hidden">
                    <div className="dropdown dropdown-left">
                      <div
                        tabIndex={0}
                        role="button"
                        className="bg-gray-700 py-1 px-1 rounded-md m-1"
                      >
                        <CgMenuLeftAlt className="text-white text-xl" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="font-bold text-xs dropdown-content z-[1] menu p-1 shadow-xl bg-white rounded-md w-52 border border-gray-200"
                      >
                        <li className="hover:bg-gray-700 hover:text-white rounded-md">
                          <button
                            onClick={() => {
                              handleObtenerId(s.id),
                                document
                                  .getElementById("my_modal_eliminar")
                                  .showModal();
                            }}
                            type="button"
                          >
                            Eliminar egreso
                          </button>
                        </li>{" "}
                        {/* <li className="hover:bg-gray-700 hover:text-white rounded-md">
                          <button type="button">Actualizar egreso</button>
                        </li> */}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalNuevoRegistro />
      <ModalEliminar idObtenida={idObtenida} />
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const { setEgresos } = useEgresosContext();
  const { setCaja } = useRemuneracionContext();

  const onSubmit = async (formData) => {
    try {
      // Quitar el formato de 'recaudacion' antes de enviar
      const valorSinFormato = valor.replace(/\./g, ""); // Elimina los puntos del formato de moneda
      const valorNumerico = parseInt(valorSinFormato, 10); // Convierte a número entero

      const ordenData = {
        ...formData,
        recaudacion: valorNumerico, // Asigna el valor limpio a 'recaudacion'
      };

      const res = await client.post("/gastos", ordenData);

      setEgresos(res.data.gastos);
      setCaja(res.data.caja);

      reset();

      toast.success("¡Egreso cargado correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          borderRadius: 0,
        },
      });

      document.getElementById("my_modal_nuevo_egreso").close();
    } catch (error) {
      console.error("Error creando el producto:", error);
    }
  };

  const [valor, setValor] = useState("");

  const formatCurrency = (value) => {
    const num = value.replace(/\D/g, ""); // Elimina cualquier cosa que no sea un número
    return new Intl.NumberFormat("es-AR").format(num); // Formatea el número en formato moneda
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatCurrency(inputValue);
    setValor(formattedValue);
  };

  return (
    <dialog id="my_modal_nuevo_egreso" className="modal">
      <div className="modal-box rounded-md max-w-xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Generar nuevo egreso en la caja de logística
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Total del egreso</label>
              <input
                {...register("recaudacion")}
                value={valor}
                onChange={handleInputChange}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none w-full font-bold placeholder:font-medium"
                placeholder="$"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Observación</label>
              <textarea
                {...register("observacion")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none w-full font-bold placeholder:font-medium"
                placeholder="Observación del egreso..."
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-gradient-to-r from-primary to-indigo-600 py-1.5 px-6 rounded-md text-white font-semibold text-sm outline-none ">
              Cargar nuevo egreso
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setEgresos } = useEgresosContext();
  const { setCaja } = useRemuneracionContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/gastos/${idObtenida}`, ordenData);

      setEgresos(res.data.gastos);
      setCaja(res.data.caja);

      document.getElementById("my_modal_eliminar").close();

      showSuccessToastError("Eliminado correctamente");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_eliminar" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img
              className="w-44 mx-auto"
              src="https://app.holded.com/assets/img/document/doc_delete.png"
            />
          </div>
          <div className="font-semibold text-sm text-gray-400 text-center">
            REFERENCIA {idObtenida}
          </div>
          <div className="font-semibold text-[#FD454D] text-lg text-center">
            Eliminar la salida cargada..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El documento no podra ser recuperado nunca mas...
          </div>
          <div className="mt-4 text-center w-full px-16">
            <button
              type="submit"
              className="bg-red-500 py-1 px-4 text-center font-bold text-white text-sm rounded-md w-full"
            >
              Confirmar
            </button>{" "}
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_eliminar").close()
              }
              className="bg-orange-100 py-1 px-4 text-center font-bold text-orange-600 mt-2 text-sm rounded-md w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
