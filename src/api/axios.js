import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND || "http://localhost:4000/api";
// import.meta.env.VITE_BACKEND ||

const client = axios.create({
  baseURL,
  withCredentials: true,
});

export default client;
