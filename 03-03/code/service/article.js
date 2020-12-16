import { request } from "~/plugins/request";
export function getList(params) {
  return request.get("/api/articles", { params });
}
export function getTags() {
  return request.get("/api/tags");
}
export function favorite(params) {
  return request.post(`/api/articles/${params}/favorite`);
}
export function unfavorite(params) {
  return request.delete(`/api/articles/${params}/favorite`);
}
export function feedArticles(params) {
  return request.get("/api/articles/feed", { params });
}
export function getArticle(slug) {
  return request.get(`/api/articles/${slug}`);
}
export function addArticle(params) {
  return request.post(`/api/articles`, params);
}
export function getComments(slug) {
  return request.get(`/api/articles/${slug}/comments`);
}
export function addComment(slug, params) {
  return request.post(`/api/articles/${slug}/comments`, params);
}
export function deleteComment(slug, id) {
  return request.delete(`/api/articles/${slug}/${id}`);
}
