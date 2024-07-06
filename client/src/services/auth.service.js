import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/auth";

export async function login(username, password) {
  const response = await axios.post(
    `${API_URL}/login`,
    { username, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const { access_token, status, user } = response.data;

  if (access_token) {
    localStorage.setItem("token", access_token);
  }

  const data = { token: access_token, user, status };

  return data;
}

export async function register(fullName, username, password) {
  const response = await axios.post(
    `${API_URL}/register`,
    { username, password, full_name: fullName },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
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
  if (!decoded.exp) return null;

  return decoded.exp * 1000;
}

export function isTokenExpired(bearerToken) {
  const expiry = getTokenExpiry(bearerToken);
  if (!expiry) return false;
  return Date.now() > expiry;
}

const authService = {
  login,
  logout,
  isTokenExpired,
  getPayloadFromToken,
  register,
};

export default authService;
