//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const LegalesContext = createContext();

//use context
export const useLegalesContext = () => {
  const context = useContext(LegalesContext);
  if (!context) {
    throw new Error("Use LegalesProvider");
  }
  return context;
};

//
export const LegalesProvider = ({ children }) => {
  const [legales, setLegales] = useState([]);
  const [legalesAdmin, setLegalesAdmin] = useState([]);
  const [legalesMensualesAdmin, setLegalesMensuales] = useState([]);
  const [legalesReal, setLegalesReal] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/legales-mes");

      setLegales(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/legales-mes-admin");

      setLegalesMensuales(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/legales");

      setLegalesReal(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/legales-admin");

      setLegalesAdmin(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <LegalesContext.Provider
      value={{
        legales,
        setLegales,
        legalesReal,
        legalesAdmin,
        legalesMensualesAdmin,
        setLegalesReal,
      }}
    >
      {children}
    </LegalesContext.Provider>
  );
};
