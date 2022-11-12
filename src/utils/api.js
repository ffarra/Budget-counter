import axios from "axios";

const instance = axios.create({baseURL: "wallet"})

export default instance