import request from "@/utils/request";
export function getList(params) {
  return request.get("/api/articles", params);
}
