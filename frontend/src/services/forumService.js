import axios from "axios";
import { getApiUrl } from "@/config/api.js";

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Servicio de API para el Foro
export const forumService = {
  // ==================== TEST ====================
  testConnection: async () => {
    try {
      const response = await apiClient.get("/api/test");
      return response.data;
    } catch (error) {
      console.error("Error al probar conexión:", error);
      throw error;
    }
  },

  // ==================== POSTS ====================
  getAllPosts: async () => {
    try {
      const response = await apiClient.get("/api/posts");
      return response.data;
    } catch (error) {
      console.error("Error al obtener posts:", error);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await apiClient.get(`/api/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener post:", error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await apiClient.post("/api/posts", postData);
      return response.data;
    } catch (error) {
      console.error("Error al crear post:", error);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await apiClient.put(`/api/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar post:", error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await apiClient.delete(`/api/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar post:", error);
      throw error;
    }
  },

  // ==================== COMENTARIOS ====================
  getCommentsByPostId: async (postId) => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      throw error;
    }
  },

  createComment: async (commentData) => {
    try {
      const response = await apiClient.post("/api/comments", commentData);
      return response.data;
    } catch (error) {
      console.error("Error al crear comentario:", error);
      throw error;
    }
  },

  deleteComment: async (id) => {
    try {
      const response = await apiClient.delete(`/api/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      throw error;
    }
  },

  // ==================== LIKES/DISLIKES ====================
  togglePostLike: async (likeData) => {
    try {
      const response = await apiClient.post("/api/posts/like", likeData);
      return response.data;
    } catch (error) {
      console.error("Error al dar like/dislike al post:", error);
      throw error;
    }
  },

  toggleCommentLike: async (likeData) => {
    try {
      const response = await apiClient.post("/api/comments/like", likeData);
      return response.data;
    } catch (error) {
      console.error("Error al dar like/dislike al comentario:", error);
      throw error;
    }
  },

  // ==================== REPUTACIÓN ====================
  getUserReputation: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/reputation`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reputación:", error);
      throw error;
    }
  },
};

export default forumService;
