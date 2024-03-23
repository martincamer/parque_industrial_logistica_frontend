//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerSalidaMensual } from "../api/ingresos";
import io from "socket.io-client";

//context
export const SalidasContext = createContext();

//use context
export const useSalidasContext = () => {
  const context = useContext(SalidasContext);
  if (!context) {
    throw new Error("Use Salidas Propvider");
  }
  return context;
};

//
export const SalidasProvider = ({ children }) => {
  const [salidasMensuales, setSalidasMensuales] = useState([]);
  const [choferes, setChoferes] = useState([]);
  // const [socket, setSocket] = useState(null);

  // // Efecto para establecer la conexión del socket
  // useEffect(() => {
  //   const newSocket = io(
  //     import.meta.env.VITE_BACKEND || "http://localhost:4000",
  //     {
  //       withCredentials: true,
  //       extraHeaders: {
  //         "my-custom-header": "value",
  //       },
  //     }
  //   );

  //   setSocket(newSocket);

  //   return () => newSocket.close();
  // }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerSalidaMensual();
      setSalidasMensuales(respuesta.data);
    }

    loadData();
  }, []);

  // useEffect(() => {
  //   // Aquí puedes enviar las actualizaciones a través de sockets
  //   if (socket) {
  //     socket.emit("actualizar-salidas", salidasMensuales);
  //   }
  // }, [socket, salidasMensuales]);

  // useEffect(() => {
  //   // Aquí puedes enviar las actualizaciones a través de sockets
  //   if (socket) {
  //     socket.emit("actualizar-choferes", choferes);
  //   }
  // }, [socket, choferes]);

  return (
    <SalidasContext.Provider
      value={{ salidasMensuales, setSalidasMensuales, choferes, setChoferes }}
    >
      {children}
    </SalidasContext.Provider>
  );
};
