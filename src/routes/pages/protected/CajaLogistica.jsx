import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from ".././../../api/axios";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useAuth } from "../../../context/AuthProvider";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import { FaEdit } from "react-icons/fa";
import { useObtenerId } from "../../../helpers/obtenerId";

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
        <div className="border border-gray-300 py-5 px-5 w-1/5">
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
