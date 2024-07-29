import { useState } from "react";
import { useSalidasContext } from "../../context/SalidasProvider";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import client from "../../api/axios";

export const ModalCrearChoferes = () => {
  const { choferes, setChoferes } = useSalidasContext();

  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await client.post("/chofer", data);

      setChoferes(res.data);

      toast.success("¡Chofer creado correctamente!", {
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

      document.getElementById("my_modal_crear_chofer").close();
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  });
  return (
    <dialog id="my_modal_crear_chofer" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {error ? (
          <div
            className="
                bg-red-100 text-red-800 py-2 px-4 text-sm uppercase text-center rounded-2xl mb-3"
          >
            {error}
          </div>
        ) : (
          ""
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Nombre y Apellido
            </label>
            <input
              {...register("chofer", { required: true })}
              placeholder="Nombre y apellido del chofer.."
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Guardar el chofer
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
