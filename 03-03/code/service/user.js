import { request } from "~/plugins/request";
export function login(params) {
  return request.post("/api/users/login", params);
}
export function register(params) {
  return request.post("/api/users", params);
}
export function updateUser(params) {
  return request.put(`/api/user`, params)
}
export function getProfile(username) {
  return request.get(`/api/profiles/${username}`)
}