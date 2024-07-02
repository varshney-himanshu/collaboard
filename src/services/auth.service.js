import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/auth";

export async function login(userData) {
  console.log("payload", userData);
  const response = await axios.post(`${API_URL}/login`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  console.log("response data", response);
  const { access_token, status, user } = response.data;

  if (access_token) {
    localStorage.setItem("token", access_token);
  }

  const data = { token: access_token, user, status };

  console.log(data);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function extractToken(bearerToken) {
  if (bearerToken && bearerToken.startsWith("Bearer ")) {
    return bearerToken.slice(7, bearerToken.length);
  } else {
    return bearerToken;
  }
}

export function getPayloadFromToken(bearerToken) {
  const token = extractToken(bearerToken);

  if (!token) return null;

  const decoded = jwtDecode(token);
  return decoded;
}

export function getTokenExpiry(bearerToken) {
  const decoded = jwtDecode(bearerToken);
  console.log("decoded jwt token", decoded);
  if (!decoded.exp) return null;

  return decoded.exp * 1000;
}

export function isTokenExpired(bearerToken) {
  console.log("checking if token expired");
  const expiry = getTokenExpiry(bearerToken);
  if (!expiry) return false;
  return Date.now() > expiry;
}

const authService = {
  login,
  logout,
  isTokenExpired,
  getPayloadFromToken,
};

export default authService;
