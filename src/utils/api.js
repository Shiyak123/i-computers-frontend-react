
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api", // Manually setting this fixes the 404
});

export default api;