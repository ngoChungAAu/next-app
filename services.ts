import axios from "axios";
import { PostFormData } from "./pages/post";

const client = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPosts = () =>
  client
    .get<{ totalItems: number; items: Post[] }>("/post/read")
    .then((res) => res.data);

export const addPost = (data: PostFormData) =>
  client.post("/post/create", data);

export const updatePost = ({
  id,
  ...data
}: Partial<PostFormData> & { id: string }) =>
  client.put(`/post/update/${id}`, data);

export const deletePost = (id: string) => client.delete(`/post/delete/${id}`);

export const getUsers = () =>
  client
    .get<{ totalItems: number; items: User[] }>("/user/read")
    .then((res) => res.data);
