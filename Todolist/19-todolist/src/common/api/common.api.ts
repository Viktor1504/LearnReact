import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "5d2e37f1-395e-4105-b8eb-f1ffe52ce33f",
  },
});
