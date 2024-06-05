import { createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";



const user = JSON.parse(localStorage.getItem("user"));
const googleToken = localStorage.getItem("googleToken");


const decodedToken = decodeToken(googleToken);