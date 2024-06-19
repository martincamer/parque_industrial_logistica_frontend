// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Label } from "../../components/formularios/Label";
import { Input } from "../../components/formularios/Input";
import { Button } from "../../components/formularios/Button";
import { InputPassword } from "../../components/formularios/InputPassword";
import ChatBotButton from "../../components/uiv2/ChatBotButton";

export const Login = () => {
  const { signin, error } = useAuth();

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/");
    }
  });

  return (
    <section className="flex items-center h-screen justify-center gap-12 max-md:px-5 max-md:h-screen relative">
      <div className="w-full bottom-0 absolute max-md:hidden">
        <svg
          className=" bottom-0 w-full h-1/3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="url(#gradient)"
            fillOpacity="1"
            d="M0,192L60,213.3C120,235,240,277,360,266.7C480,256,600,192,720,160C840,128,960,128,1080,122.7C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="40%" stopColor="orange" />
              <stop offset="60%" stopColor="darkOrange" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="w-full z-[103]">
        <form
          onSubmit={onSubmit}
          className="flex w-1/3 mx-auto flex-col gap-4 bg-white px-10 py-12 rounded-2xl  shadow-xl max-md:w-full max-md:px-5 max-md:py-10 max-md:gap-3 z-[103]"
        >
          <div className="flex justify-center">
            <h4 className="font-semibold text-2xl text-orange-500 max-md:text-xl">
              Te damos la bienvenida 👋
            </h4>
          </div>
          <div className="text-base font-medium text-slate-500 text-center max-md:text-sm">
            Ingresa al sistema de logistica de{" "}
            <span className="font-bold text-slate-600">Tecnohouse</span>.
          </div>
          {
            <div>
              <div className="flex flex-col gap-1">
                {error?.map((e) => (
                  <span
                    key={e}
                    className="bg-red-100 rounded-xl px-3 text-center uppercase py-3 text-red-800 text-sm"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          }
          <div className="flex flex-col gap-2">
            <Label label="Email del registro" />
            <Input
              register={register}
              placeholder={"emailregistro@email.com"}
              type={"email"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label label="Contraseña del registro" />
            <InputPassword
              register={register}
              placeholder={""}
              type={"password"}
            />
          </div>

          <Button type={"submit"} titulo={"Iniciar Sesión"} />

          <div className="text-sm font-medium text-center mt-5 w-1/2 mx-auto max-md:w-full">
            Si, pide a tu administrador que te cree un usuario 👀.
          </div>
        </form>
      </div>

      <ChatBotButton />
    </section>
  );
};
