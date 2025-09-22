import axios from "axios";

export const api = axios.create({
  baseURL: "https://hackathonsproject-production.up.railway.app", // Your Nest backend URL
});
