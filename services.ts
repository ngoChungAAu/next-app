import axios from "axios";
import { signOut } from "next-auth/react";
import { PostFormData } from "./pages/post";

const client = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(function (config) {
  const headers = config.headers || {};
  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers;
  }

  return config;
});

export const getPosts = () =>
  client
    .get<{ totalItems: number; items: Post[] }>("/post")
    .then((res) => res.data)
    .catch(async (error) => {
      if (error.response.status === 401) {
        await signOut({ callbackUrl: "/login", redirect: false });
      }
    });

export const addPost = (data: PostFormData) => client.post("/post", data);

export const updatePost = ({
  id,
  ...data
}: Partial<PostFormData> & { id: string }) => client.put(`/post/${id}`, data);

export const deletePost = (id: string) => client.delete(`/post/${id}`);

export const getUsers = () =>
  client
    .get<{ totalItems: number; items: User[] }>("/user")
    .then((res) => res.data)
    .catch(async (error) => {
      if (error.response.status === 401) {
        await signOut({ callbackUrl: "/login", redirect: false });
      }
    });
