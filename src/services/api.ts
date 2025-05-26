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
  ViewResult,
  CommentPageInfo,
  CommentStatusUpdateRequest,
  CategoryCreationRequest,
  CategoryUpdateRequest
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

// Moved mockComments to a scope accessible by both getAllComments and updateCommentStatus
const mockCommentsData: Comment[] = [
  { id: 101, articleId: 1, userId: 1, content: '这是第一条待审核的评论内容，来自文章1', parentId: null, status: 'pending', createdAt: '2024-05-30T10:00:00', updatedAt: '2024-05-30T10:00:00', authorName: '模拟用户A' },
  { id: 102, articleId: 2, userId: 2, content: '这是第二条已批准的评论，内容很棒！来自文章2', parentId: null, status: 'approved', createdAt: '2024-05-30T11:00:00', updatedAt: '2024-05-30T11:00:00', authorName: '模拟用户B' },
  { id: 103, articleId: 1, userId: 3, content: '这是第三条被拒绝的评论，包含不当言论。来自文章1', parentId: null, status: 'rejected', createdAt: '2024-05-30T12:00:00', updatedAt: '2024-05-30T12:00:00', authorName: '模拟用户C' },
];

export const commentsApi = {
  getComments: async (articleId: number, params?: { page?: number; pageSize?: number }) => {
    const res = await api.get<BaseResponse<any>>(
      `/articles/${articleId}/comments`,
      { params }
    );

    let processedData: PageInfo<Comment> | null = null;

    // Assuming res.data is BaseResponse and res.data.data is CommentPageInfo
    if (res.data && res.data.data) { 
      const rawPageInfo = res.data.data as CommentPageInfo;
      
      processedData = {
        list: rawPageInfo.records || [],
        pageNum: rawPageInfo.current,
        pageSize: rawPageInfo.size, // API's 'size' (e.g., 10) is our 'pageSize'
        total: rawPageInfo.total,
        pages: rawPageInfo.pages,
        // Ensure these are correctly derived or available
        isFirstPage: rawPageInfo.current === 1,
        isLastPage: rawPageInfo.current === rawPageInfo.pages || rawPageInfo.pages === 0,
        size: (rawPageInfo.records || []).length, // Corrected: 'size' is the count of items in the current page's list
      };
    }

    return {
      code: res.data?.code || "",
      msg: res.data?.msg || "",
      data: processedData,
    } as BaseResponse<PageInfo<Comment>>;
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

  getAllComments: async (params?: { page?: number; pageSize?: number; status?: string; keyword?: string }) => {
    console.warn('getAllComments is using mock data. Please connect to a real API.');
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    // Using the shared mockCommentsData
    const filteredComments = mockCommentsData.filter(c => 
      (!params?.status || c.status === params.status) && 
      (!params?.keyword || c.content.includes(params.keyword) || (c.authorName && c.authorName.includes(params.keyword)))
    );
    const paginatedComments = filteredComments.slice((page - 1) * pageSize, page * pageSize);

    const response: BaseResponse<PageInfo<Comment>> = {
      code: '200',
      msg: '操作成功 (模拟数据)',
      data: {
        list: paginatedComments,
        pageNum: page,
        pageSize: pageSize,
        total: filteredComments.length,
        pages: Math.ceil(filteredComments.length / pageSize),
        isFirstPage: page === 1,
        isLastPage: page === Math.ceil(filteredComments.length / pageSize) || Math.ceil(filteredComments.length / pageSize) === 0,
        size: paginatedComments.length, // Added size here
      }
    };
    return response;
  },

  updateCommentStatus: async (id: number, statusUpdateValue: string): Promise<BaseResponse<Comment>> => {
    console.log(`Updating status for comment ${id} to ${statusUpdateValue}`);
    // Using the shared mockCommentsData
    const commentIndex = mockCommentsData.findIndex(c => c.id === id);
    if (commentIndex > -1) {
      // @ts-ignore status should be on Comment type
      mockCommentsData[commentIndex] = { ...mockCommentsData[commentIndex], status: statusUpdateValue, updatedAt: new Date().toISOString() };
      // @ts-ignore status should be on Comment type
      return Promise.resolve({ code: '200', msg: '操作成功 (模拟数据)', data: { ...mockCommentsData[commentIndex] } });
    }
    return Promise.reject(new Error('Comment not found for status update (mock)'));
  },
};

export const categoriesApi = {
  getCategories: async (page: number = 1, pageSize: number = 10): Promise<BaseResponse<PageInfo<Category>>> => {
    // As per Project Interface.md, /api/categories returns PageInfo<Category> directly.
    // We need to wrap it in BaseResponse.
    const response = await api.get<PageInfo<Category>>(`/categories?page=${page}&page_size=${pageSize}`);
    if (response.data) {
      // response.data is PageInfo<Category>
      return {
        code: "200", // Assuming success if data is received
        msg: "操作成功", // Assuming success
        data: response.data 
      };
    } else {
      // Fallback for unexpected response structure or errors not caught by axios
      return {
        code: response.status ? response.status.toString() : "CLIENT_ERROR",
        msg: response.statusText || "获取分类列表失败或响应格式不正确",
        data: null
      };
    }
  },
  getCategoryById: async (id: number): Promise<BaseResponse<Category>> => {
    const response = await api.get<BaseResponse<Category>>(`/categories/${id}`);
    return response.data; // Corrected: return actual data
  },
  createCategory: async (data: CategoryCreationRequest): Promise<BaseResponse<Category>> => {
    const response = await api.post<BaseResponse<Category>>('/categories', data);
    return response.data; // Corrected: return actual data
  },
  updateCategory: async (id: number, data: CategoryUpdateRequest): Promise<BaseResponse<Category>> => {
    const response = await api.put<BaseResponse<Category>>(`/categories/${id}`, data);
    return response.data; // Corrected: return actual data
  },
  deleteCategory: async (id: number): Promise<BaseResponse<null>> => {
    // MOCK IMPLEMENTATION - API for deleting a category is not defined in Project Interface.md
    console.warn(`Mock deleteCategory called for ID: ${id}. No API endpoint defined.`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: '200', msg: '分类已模拟删除 (无真实API)', data: null });
      }, 500);
    });
  },
};

export const tagsApi = {
  getTags: async (params?: { keyword?: string; page?: number; pageSize?: number }) => {
    const apiParams: { keyword?: string; page?: number; page_size?: number } = {};
    if (params) {
      if (params.keyword) apiParams.keyword = params.keyword;
      if (params.page) apiParams.page = params.page;
      if (params.pageSize) apiParams.page_size = params.pageSize;
    }
    const response = await api.get<BaseResponse<PageInfo<Tag>>>('/tags', { params: apiParams });
    return response.data;
  },

  getTagById: async (id: number) => {
    const response = await api.get<BaseResponse<Tag>>(`/tags/${id}`);
    return response.data;
  },

  createTag: async (tag: Tag) => { // Assuming Tag type for creation is same as Tag type for display
    const response = await api.post<BaseResponse<Tag>>('/tags', tag);
    return response.data;
  },

  updateTag: async (id: number, tag: Tag) => { // Assuming Tag type for update is same as Tag type for display
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
