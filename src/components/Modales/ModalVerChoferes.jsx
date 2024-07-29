import { useSalidasContext } from "../../context/SalidasProvider";
import { toast } from "react-toastify";
import { useObtenerId } from "../../helpers/obtenerId";
import client from "../../api/axios";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export const ModalVerChoferes = () => {
  const { choferes, setChoferes } = useSalidasContext();
  const { handleObtenerId, idObtenida } = useObtenerId();
  const handleEliminarChofer = async (id) => {
    const res = await client.delete(`/chofer/${id}`);

    setChoferes(res.data);

    toast.error("¡Chofer eliminado correctamente!", {
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
  };
  return (
    <dialog id="my_modal_ver_choferes" className="modal">
      <div className="modal-box max-w-3xl rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-1">Choferes creados.</h3>
        <div className="grid grid-cols-3 max-md:grid-cols-1  py-2 px-2 gap-3">
          {choferes.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 border border-gray-300 rounded-md py-2 px-2 justify-between"
            >
              <p className="font-bold text-slate-700 uppercase text-xs">
                {c.chofer}
              </p>
              <div className="flex gap-1">
                <svg
                  onClick={() => handleEliminarChofer(c.id)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-red-900 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                <svg
                  onClick={() => {
                    handleObtenerId(c.id),
                      document
                        .getElementById("my_modal_editar_chofer")
                        .showModal();
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
        <ModalEditarChofer idObtenida={idObtenida} />
      </div>
    </dialog>
  );
};

export const ModalEditarChofer = ({ idObtenida }) => {
  const { setChoferes } = useSalidasContext();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/chofer/${idObtenida}`);

      setValue("chofer", res.data.chofer);
      setValue("id", res.data.id);
    }

    loadData();
  }, [idObtenida]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/chofer/${idObtenida}`, data);

    setChoferes(res.data);

    toast.success("¡Chofer editado correctamente!", {
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

    document.getElementById("my_modal_editar_chofer").close();
  });

  return (
    <dialog id="my_modal_editar_chofer" className="modal">
      <div className="modal-box rounded-md py-14">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-3">Actualizar el chofer.</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Nombre y Apellido
            </label>
            <input
              {...register("chofer", { required: true })}
              placeholder="NOMBRE Y APELLIDO DEL CLIENTE"
              type="text"
              className="border border-gray-300 py-2 px-4 rounded-md capitalize font-medium outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar el chofer
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
