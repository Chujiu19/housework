import request from "@/utils/request";
export function getList(params) {
  console.log(params)
  return request.get("/api/articles", {params});
}
export function getTags() {
  return request.get("/api/tags");
}
export function favorite(params) {
  return request.post(`/api/articles/${params}/favorite`)
}
export function unfavorite(params) {
  return request.delete(`/api/articles/${params}/favorite`)
}