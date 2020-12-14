import request from "@/utils/request";
export function login(params) {
  return request.post("/api/users/login", params);
}
export function register(params) {
  return request.post("/api/users", params);
}
