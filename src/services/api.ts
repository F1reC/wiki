import axios from 'axios';
import { 
  BaseResponse, 
  PageInfo, 
  Article, 
  Comment, 
  Category, 
  Tag, 
  OverallStats,
  ArticleCreationRequest,
  ArticleUpdateRequest,
  CommentCreationRequest,
  LikeResult,
  ViewResult
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const articlesApi = {
  getArticles: async (params?: {
    categoryId?: number;
    tagId?: number;
    keyword?: string;
    sort?: string;
    order?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<BaseResponse<PageInfo<Article>>>('/articles', { params });
    return response.data;
  },

  getArticleById: async (id: number) => {
    const response = await api.get<BaseResponse<Article>>(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (article: ArticleCreationRequest) => {
    const response = await api.post<BaseResponse<Article>>('/articles', article);
    return response.data;
  },

  updateArticle: async (id: number, article: ArticleUpdateRequest) => {
    const response = await api.put<BaseResponse<Article>>(`/articles/${id}`, article);
    return response.data;
  },

  deleteArticle: async (id: number) => {
    const response = await api.delete<BaseResponse<null>>(`/articles/${id}`);
    return response.data;
  },

  likeArticle: async (id: number) => {
    const response = await api.post<BaseResponse<LikeResult>>(`/articles/${id}/like`);
    return response.data;
  },

  viewArticle: async (id: number) => {
    const response = await api.post<BaseResponse<ViewResult>>(`/articles/${id}/view`);
    return response.data;
  },
};

export const commentsApi = {
  getComments: async (articleId: number, params?: { page?: number; pageSize?: number }) => {
    const response = await api.get<BaseResponse<PageInfo<Comment>>>(
      `/articles/${articleId}/comments`,
      { params }
    );
    return response.data;
  },

  createComment: async (articleId: number, comment: CommentCreationRequest) => {
    const response = await api.post<BaseResponse<Comment>>(
      `/articles/${articleId}/comments`,
      comment
    );
    return response.data;
  },

  deleteComment: async (id: number) => {
    const response = await api.delete<BaseResponse<null>>(`/comments/${id}`);
    return response.data;
  },
};

export const categoriesApi = {
  getCategories: async (params?: { parent_id?: number; page?: number; pageSize?: number }) => {
    const response = await api.get<BaseResponse<PageInfo<Category>>>('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id: number) => {
    const response = await api.get<BaseResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: Category) => {
    const response = await api.post<BaseResponse<Category>>('/categories', category);
    return response.data;
  },

  updateCategory: async (id: number, category: Category) => {
    const response = await api.put<BaseResponse<Category>>(`/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete<BaseResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};

export const tagsApi = {
  getTags: async (params?: { keyword?: string; page?: number; pageSize?: number }) => {
    const response = await api.get<BaseResponse<PageInfo<Tag>>>('/tags', { params });
    return response.data;
  },

  getTagById: async (id: number) => {
    const response = await api.get<BaseResponse<Tag>>(`/tags/${id}`);
    return response.data;
  },

  createTag: async (tag: Tag) => {
    const response = await api.post<BaseResponse<Tag>>('/tags', tag);
    return response.data;
  },

  updateTag: async (id: number, tag: Tag) => {
    const response = await api.put<BaseResponse<Tag>>(`/tags/${id}`, tag);
    return response.data;
  },

  deleteTag: async (id: number) => {
    const response = await api.delete<BaseResponse<null>>(`/tags/${id}`);
    return response.data;
  },
};

export const statsApi = {
  getOverallStats: async () => {
    const response = await api.get<BaseResponse<OverallStats>>('/stats');
    return response.data;
  },
};

export const chatApi = {
  getChatResponse: async (msg: string) => {
    const response = await axios.get<string>(`http://localhost:8080/ai/chat`, { params: { msg } });
    return response.data;
  }
}

export default api;
