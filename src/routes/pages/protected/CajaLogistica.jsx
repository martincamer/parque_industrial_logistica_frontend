import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from ".././../../api/axios";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useAuth } from "../../../context/AuthProvider";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import { FaEdit } from "react-icons/fa";
import { useObtenerId } from "../../../helpers/obtenerId";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { formatearFecha } from "../../../helpers/formatearFecha";

export const CajaLogistica = () => {
  const { caja } = useRemuneracionContext();
  const { user } = useAuth();

  console.log(caja);

  // Filter caja based on user's localidad
  const filteredCajas = caja.filter(
    (item) => item.localidad === user.localidad
  );

  // Calculate the total
  const totalCaja = filteredCajas.reduce(
    (total, item) => total + parseFloat(item.total),
    0
  );

  const { handleObtenerId, idObtenida } = useObtenerId();

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

    return filterByDate && filterByFactory;
  });

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">
          Sector de logistica caja.
        </p>

        <div>
          {filteredCajas.length > 0 ? (
            ""
          ) : (
            <button
              onClick={() =>
                document
                  .getElementById("my_modal_crear_caja_logistica")
                  .showModal()
              }
              type="button"
              className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
            >
              Crear caja de logistica si no existe.
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-5 flex">
        <div className="border border-gray-300 py-5 px-5 w-1/5 max-md:w-full">
          <div className="flex justify-end">
            <FaEdit
              onClick={() => {
                handleObtenerId(filteredCajas[0]?.id),
                  document.getElementById("my_modal_editar_caja").showModal();
              }}
              className="text-2xl cursor-pointer text-blue-600"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="font-bold text-xl">Caja de logística.</p>
            {/* Display the total if there are filtered cajas */}
            {filteredCajas?.length > 0 ? (
              <p
                className={`font-bold text-3xl ${
                  totalCaja < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {formatearDinero(Number(totalCaja))}
              </p>
            ) : (
              <p>No tienes una caja ahún.</p>
            )}
          </div>
        </div>
      </div>

      <article className="flex gap-2 max-md:flex-col">
        <div className="px-5 py-5 w-auto border mx-5 border-gray-300 flex gap-5 max-md:flex-col max-md:gap-0">
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
      </article>

      <div className="px-5 py-5 max-md:overflow-x-auto scrollbar-hidden">
        <table className="table">
          <thead className="text-sm font-bold text-gray-800">
            <tr>
              <th>Numero</th>
              <th>Usuario</th>
              <th>Sucursal</th>
              <th>Fecha</th>
              <th>Mes</th>
              <th>Entrada a la caja</th>
            </tr>
          </thead>

          <tbody className="text-xs font-medium capitalize">
            {filteredData
              .filter((s) => s.localidad === user.localidad) // Filtrar por localidad del usuario
              .map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.usuario}</td>
                  <td>{s.sucursal}</td>
                  <td>{formatearFecha(s.fecha_entrega)}</td>
                  <td>
                    {new Date(s.created_at).toLocaleString("default", {
                      month: "long",
                    })}
                  </td>
                  <td>
                    <div className="flex">
                      <p
                        className={`font-bold py-1 px-2 rounded-md ${
                          s.recaudacion >= 0
                            ? "bg-green-100/80 text-green-700"
                            : "bg-red-100/80 text-red-700"
                        } `}
                      >
                        {Number(s.recaudacion).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        })}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalCrearCajaLogistica />
      <ModalEditarCajaLogistica idObtenida={idObtenida} />
    </section>
  );
};

export const ModalCrearCajaLogistica = () => {
  const [error, setError] = useState("");
  const { setCaja } = useRemuneracionContext();

  const { register, handleSubmit, reset, watch } = useForm();
  const total = watch("total");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await client.post("/cajas", data);

      setCaja(res.data);

      toast.success("¡Caja creada correctamente!", {
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

      reset();

      document.getElementById("my_modal_crear_caja_logistica").close();
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_crear_caja_logistica" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-sm">
          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Total de la caja</label>
                <input
                  {...register("total", { required: true })}
                  type="text"
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Total de la caja</label>

                <p className="border border-gray-300 font-bold py-2 px-2 rounded-md capitalize text-sm outline-none w-auto">
                  {formatearDinero(Number(total) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-4 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Crear la caja de logistica
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export const ModalEditarCajaLogistica = ({ idObtenida }) => {
  const { setCaja } = useRemuneracionContext();
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, watch } = useForm();

  const total = watch("total");

  useEffect(() => {
    const loadData = async () => {
      const res = await client.get(`/cajas/${idObtenida}`);
      console.log(res);
      setValue("total", res.data.total);
    };
    loadData();
  }, [idObtenida]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await client.put(`/cajas/${idObtenida}`, data);

      setCaja(res.data);

      toast.success("¡Caja actualizada correctamente!", {
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

      document.getElementById("my_modal_editar_caja").close();
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_editar_caja" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-sm">
          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Total de la caja</label>
                <input
                  {...register("total", { required: true })}
                  type="text"
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Total de la caja</label>

                <p className="border border-gray-300 font-bold py-2 px-2 rounded-md capitalize text-sm outline-none w-auto">
                  {formatearDinero(Number(total) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-4 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar la caja de logistica
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
