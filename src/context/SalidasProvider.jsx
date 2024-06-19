//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerSalidaMensual } from "../api/ingresos";
import client from "../api/axios";

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
  const [salidasMensualesAdmin, setSalidasMensualesAdmin] = useState([]);
  const [salidas, setSalidas] = useState([]);

  const [choferes, setChoferes] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerSalidaMensual();
      setSalidasMensuales(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/salidas");
      setSalidas(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/salidas-mes-todas");
      setSalidasMensualesAdmin(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <SalidasContext.Provider
      value={{
        salidasMensuales,
        setSalidasMensuales,
        choferes,
        setChoferes,
        salidasMensualesAdmin,
        salidas,
        setSalidas,
      }}
    >
      {children}
    </SalidasContext.Provider>
  );
};
