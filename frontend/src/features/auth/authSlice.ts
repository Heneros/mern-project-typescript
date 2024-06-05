import { createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";
import { User } from 'shared/types/User';


// userString должен быть строкой, так как localStorage.getItem возвращает строку или null. Если localStorage не содержит значения для "user", вы предоставляете пустой массив [] в качестве значения по умолчанию. Это приведет к ошибке, потому что массив не может быть назначен строковой переменной.
const userString = localStorage.getItem("user") || '';
const googleToken = localStorage.getItem("googleToken");
let user: User | null = null;

if (userString) {
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
}

const decodedToken: User | null = googleToken ? decodeToken(googleToken) : null;

interface AuthSlice {
  user: User | null;
  googleToken: string | null;
}

const initialState: AuthSlice = {
  user: user || (decodedToken && typeof decodedToken === "object" ? decodedToken : null),
  googleToken: googleToken ? googleToken : null,
};

export default initialState;

