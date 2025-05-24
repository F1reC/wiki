import { 
  BaseResponse, 
  ArticleCreationRequest,
  ArticleUpdateRequest,
  CommentCreationRequest,
  Category,
  Tag
} from '../types';
import { 
  articlesApi, 
  commentsApi, 
  categoriesApi, 
  tagsApi, 
  statsApi 
} from './api';
import { 
  mockArticlesApi, 
  mockCommentsApi, 
  mockCategoriesApi, 
  mockTagsApi, 
  mockStatsApi 
} from './mockApi';

const USE_MOCK_DATA = true;

async function withFallback<T>(
  realApiCall: () => Promise<BaseResponse<T>>,
  mockApiCall: () => Promise<BaseResponse<T>>
): Promise<BaseResponse<T>> {
  if (USE_MOCK_DATA) {
    return mockApiCall();
  }

  try {
    return await realApiCall();
  } catch (error) {
    console.warn('API call failed, falling back to mock data', error);
    return mockApiCall();
  }
}

export const articlesApiWithFallback = {
  getArticles: async (params?: {
    categoryId?: number;
    tagId?: number;
    keyword?: string;
    sort?: string;
    order?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return withFallback(
      () => articlesApi.getArticles(params),
      () => mockArticlesApi.getArticles(params)
    );
  },

  getArticleById: async (id: number) => {
    return withFallback(
      () => articlesApi.getArticleById(id),
      () => mockArticlesApi.getArticleById(id)
    );
  },

  createArticle: async (article: ArticleCreationRequest) => {
    return withFallback(
      () => articlesApi.createArticle(article),
      () => mockArticlesApi.createArticle(article)
    );
  },

  updateArticle: async (id: number, article: ArticleUpdateRequest) => {
    return withFallback(
      () => articlesApi.updateArticle(id, article),
      () => mockArticlesApi.updateArticle(id, article)
    );
  },

  deleteArticle: async (id: number) => {
    return withFallback(
      () => articlesApi.deleteArticle(id),
      () => mockArticlesApi.deleteArticle(id)
    );
  },

  likeArticle: async (id: number) => {
    return withFallback(
      () => articlesApi.likeArticle(id),
      () => mockArticlesApi.likeArticle(id)
    );
  },

  viewArticle: async (id: number) => {
    return withFallback(
      () => articlesApi.viewArticle(id),
      () => mockArticlesApi.viewArticle(id)
    );
  },
};

export const commentsApiWithFallback = {
  getComments: async (articleId: number, params?: { page?: number; pageSize?: number }) => {
    return withFallback(
      () => commentsApi.getComments(articleId, params),
      () => mockCommentsApi.getComments(articleId, params)
    );
  },

  createComment: async (articleId: number, comment: CommentCreationRequest) => {
    return withFallback(
      () => commentsApi.createComment(articleId, comment),
      () => mockCommentsApi.createComment(articleId, comment)
    );
  },

  deleteComment: async (id: number) => {
    return withFallback(
      () => commentsApi.deleteComment(id),
      () => mockCommentsApi.deleteComment(id)
    );
  },
};

export const categoriesApiWithFallback = {
  getCategories: async (params?: { parent_id?: number; page?: number; pageSize?: number }) => {
    return withFallback(
      () => categoriesApi.getCategories(params),
      () => mockCategoriesApi.getCategories(params)
    );
  },

  getCategoryById: async (id: number) => {
    return withFallback(
      () => categoriesApi.getCategoryById(id),
      () => mockCategoriesApi.getCategoryById(id)
    );
  },

  createCategory: async (category: Category) => {
    return withFallback(
      () => categoriesApi.createCategory(category),
      () => mockCategoriesApi.createCategory(category)
    );
  },

  updateCategory: async (id: number, category: Category) => {
    return withFallback(
      () => categoriesApi.updateCategory(id, category),
      () => mockCategoriesApi.updateCategory(id, category)
    );
  },

  deleteCategory: async (id: number) => {
    return withFallback(
      () => categoriesApi.deleteCategory(id),
      () => mockCategoriesApi.deleteCategory(id)
    );
  },
};

export const tagsApiWithFallback = {
  getTags: async (params?: { keyword?: string; page?: number; pageSize?: number }) => {
    return withFallback(
      () => tagsApi.getTags(params),
      () => mockTagsApi.getTags(params)
    );
  },

  getTagById: async (id: number) => {
    return withFallback(
      () => tagsApi.getTagById(id),
      () => mockTagsApi.getTagById(id)
    );
  },

  createTag: async (tag: Tag) => {
    return withFallback(
      () => tagsApi.createTag(tag),
      () => mockTagsApi.createTag(tag)
    );
  },

  updateTag: async (id: number, tag: Tag) => {
    return withFallback(
      () => tagsApi.updateTag(id, tag),
      () => mockTagsApi.updateTag(id, tag)
    );
  },

  deleteTag: async (id: number) => {
    return withFallback(
      () => tagsApi.deleteTag(id),
      () => mockTagsApi.deleteTag(id)
    );
  },
};

export const statsApiWithFallback = {
  getOverallStats: async () => {
    return withFallback(
      () => statsApi.getOverallStats(),
      () => mockStatsApi.getOverallStats()
    );
  },
};
