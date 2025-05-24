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
import { 
  mockArticles, 
  mockCategories, 
  mockTags, 
  mockComments, 
  mockStats,
  createPaginatedResponse,
  filterArticles
} from './mockData';

function createSuccessResponse<T>(data: T): BaseResponse<T> {
  return {
    code: '200',
    msg: '操作成功',
    data
  };
}

function createErrorResponse<T>(msg: string, code: string = '400'): BaseResponse<T> {
  return {
    code,
    msg,
    data: null
  };
}

function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockArticlesApi = {
  getArticles: async (params?: {
    categoryId?: number;
    tagId?: number;
    keyword?: string;
    sort?: string;
    order?: string;
    page?: number;
    pageSize?: number;
  }): Promise<BaseResponse<PageInfo<Article>>> => {
    await delay();
    
    try {
      const filteredArticles = filterArticles(mockArticles, {
        categoryId: params?.categoryId,
        tagId: params?.tagId,
        keyword: params?.keyword,
        sort: params?.sort || 'createdAt',
        order: params?.order || 'desc'
      });
      
      const paginatedData = createPaginatedResponse(
        filteredArticles,
        params?.page || 1,
        params?.pageSize || 10
      );
      
      return createSuccessResponse(paginatedData);
    } catch (error) {
      return createErrorResponse('获取文章列表失败');
    }
  },

  getArticleById: async (id: number): Promise<BaseResponse<Article>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        return createErrorResponse('文章不存在', '404');
      }
      
      return createSuccessResponse(article);
    } catch (error) {
      return createErrorResponse('获取文章详情失败');
    }
  },

  createArticle: async (article: ArticleCreationRequest): Promise<BaseResponse<Article>> => {
    await delay();
    
    try {
      const newId = Math.max(...mockArticles.map(a => a.id)) + 1;
      const categoryName = mockCategories.find(c => c.id === article.categoryId)?.name || '';
      
      const newArticle: Article = {
        id: newId,
        title: article.title,
        summary: article.summary,
        content: article.content,
        categoryId: article.categoryId,
        categoryName,
        authorId: article.authorId,
        authorName: '当前用户',
        tagIds: article.tagIds || [],
        status: article.status,
        viewCount: 0,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockArticles.push(newArticle);
      
      return createSuccessResponse(newArticle);
    } catch (error) {
      return createErrorResponse('创建文章失败');
    }
  },

  updateArticle: async (id: number, article: ArticleUpdateRequest): Promise<BaseResponse<Article>> => {
    await delay();
    
    try {
      const index = mockArticles.findIndex(a => a.id === id);
      
      if (index === -1) {
        return createErrorResponse('文章不存在', '404');
      }
      
      const categoryName = mockCategories.find(c => c.id === article.categoryId)?.name || mockArticles[index].categoryName;
      
      const updatedArticle: Article = {
        ...mockArticles[index],
        title: article.title,
        summary: article.summary,
        content: article.content,
        categoryId: article.categoryId,
        categoryName,
        tagIds: article.tagIds || mockArticles[index].tagIds,
        status: article.status,
        updatedAt: new Date().toISOString()
      };
      
      mockArticles[index] = updatedArticle;
      
      return createSuccessResponse(updatedArticle);
    } catch (error) {
      return createErrorResponse('更新文章失败');
    }
  },

  deleteArticle: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockArticles.findIndex(a => a.id === id);
      
      if (index === -1) {
        return createErrorResponse('文章不存在', '404');
      }
      
      mockArticles.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('删除文章失败');
    }
  },

  likeArticle: async (id: number): Promise<BaseResponse<LikeResult>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        return createErrorResponse('文章不存在', '404');
      }
      
      article.likeCount += 1;
      
      return createSuccessResponse({
        message: '点赞成功',
        likeCount: article.likeCount
      });
    } catch (error) {
      return createErrorResponse('点赞失败');
    }
  },

  viewArticle: async (id: number): Promise<BaseResponse<ViewResult>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        return createErrorResponse('文章不存在', '404');
      }
      
      article.viewCount += 1;
      
      return createSuccessResponse({
        message: '浏览记录成功',
        viewCount: article.viewCount
      });
    } catch (error) {
      return createErrorResponse('记录浏览失败');
    }
  }
};

export const mockCommentsApi = {
  getComments: async (articleId: number, params?: { page?: number; pageSize?: number }): Promise<BaseResponse<PageInfo<Comment>>> => {
    await delay();
    
    try {
      const articleComments = mockComments.filter(c => c.articleId === articleId);
      
      const paginatedData = createPaginatedResponse(
        articleComments,
        params?.page || 1,
        params?.pageSize || 10
      );
      
      return createSuccessResponse(paginatedData);
    } catch (error) {
      return createErrorResponse('获取评论列表失败');
    }
  },

  createComment: async (articleId: number, comment: CommentCreationRequest): Promise<BaseResponse<Comment>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === articleId);
      
      if (!article) {
        return createErrorResponse('文章不存在', '404');
      }
      
      const newId = Math.max(...mockComments.map(c => c.id), 0) + 1;
      
      const newComment: Comment = {
        id: newId,
        articleId,
        userId: comment.userId,
        content: comment.content,
        parentId: comment.parentId,
        createdAt: new Date().toISOString()
      };
      
      mockComments.push(newComment);
      
      return createSuccessResponse(newComment);
    } catch (error) {
      return createErrorResponse('创建评论失败');
    }
  },

  deleteComment: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockComments.findIndex(c => c.id === id);
      
      if (index === -1) {
        return createErrorResponse('评论不存在', '404');
      }
      
      mockComments.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('删除评论失败');
    }
  }
};

export const mockCategoriesApi = {
  getCategories: async (params?: { parent_id?: number; page?: number; pageSize?: number }): Promise<BaseResponse<PageInfo<Category>>> => {
    await delay();
    
    try {
      let filteredCategories = [...mockCategories];
      
      if (params?.parent_id !== undefined) {
        filteredCategories = filteredCategories.filter(c => c.parentId === params.parent_id);
      }
      
      const paginatedData = createPaginatedResponse(
        filteredCategories,
        params?.page || 1,
        params?.pageSize || 10
      );
      
      return createSuccessResponse(paginatedData);
    } catch (error) {
      return createErrorResponse('获取分类列表失败');
    }
  },

  getCategoryById: async (id: number): Promise<BaseResponse<Category>> => {
    await delay();
    
    try {
      const category = mockCategories.find(c => c.id === id);
      
      if (!category) {
        return createErrorResponse('分类不存在', '404');
      }
      
      return createSuccessResponse(category);
    } catch (error) {
      return createErrorResponse('获取分类详情失败');
    }
  },

  createCategory: async (category: Category): Promise<BaseResponse<Category>> => {
    await delay();
    
    try {
      const newId = Math.max(...mockCategories.map(c => c.id)) + 1;
      
      const newCategory: Category = {
        ...category,
        id: newId
      };
      
      mockCategories.push(newCategory);
      
      return createSuccessResponse(newCategory);
    } catch (error) {
      return createErrorResponse('创建分类失败');
    }
  },

  updateCategory: async (id: number, category: Category): Promise<BaseResponse<Category>> => {
    await delay();
    
    try {
      const index = mockCategories.findIndex(c => c.id === id);
      
      if (index === -1) {
        return createErrorResponse('分类不存在', '404');
      }
      
      const updatedCategory: Category = {
        ...mockCategories[index],
        name: category.name,
        description: category.description,
        parentId: category.parentId,
        sortOrder: category.sortOrder
      };
      
      mockCategories[index] = updatedCategory;
      
      return createSuccessResponse(updatedCategory);
    } catch (error) {
      return createErrorResponse('更新分类失败');
    }
  },

  deleteCategory: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockCategories.findIndex(c => c.id === id);
      
      if (index === -1) {
        return createErrorResponse('分类不存在', '404');
      }
      
      const hasChildren = mockCategories.some(c => c.parentId === id);
      
      if (hasChildren) {
        return createErrorResponse('存在子分类，不能删除', '400');
      }
      
      mockCategories.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('删除分类失败');
    }
  }
};

export const mockTagsApi = {
  getTags: async (params?: { keyword?: string; page?: number; pageSize?: number }): Promise<BaseResponse<PageInfo<Tag>>> => {
    await delay();
    
    try {
      let filteredTags = [...mockTags];
      
      if (params?.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredTags = filteredTags.filter(t => t.name.toLowerCase().includes(keyword));
      }
      
      const paginatedData = createPaginatedResponse(
        filteredTags,
        params?.page || 1,
        params?.pageSize || 10
      );
      
      return createSuccessResponse(paginatedData);
    } catch (error) {
      return createErrorResponse('获取标签列表失败');
    }
  },

  getTagById: async (id: number): Promise<BaseResponse<Tag>> => {
    await delay();
    
    try {
      const tag = mockTags.find(t => t.id === id);
      
      if (!tag) {
        return createErrorResponse('标签不存在', '404');
      }
      
      return createSuccessResponse(tag);
    } catch (error) {
      return createErrorResponse('获取标签详情失败');
    }
  },

  createTag: async (tag: Tag): Promise<BaseResponse<Tag>> => {
    await delay();
    
    try {
      const newId = Math.max(...mockTags.map(t => t.id)) + 1;
      
      const newTag: Tag = {
        id: newId,
        name: tag.name
      };
      
      mockTags.push(newTag);
      
      return createSuccessResponse(newTag);
    } catch (error) {
      return createErrorResponse('创建标签失败');
    }
  },

  updateTag: async (id: number, tag: Tag): Promise<BaseResponse<Tag>> => {
    await delay();
    
    try {
      const index = mockTags.findIndex(t => t.id === id);
      
      if (index === -1) {
        return createErrorResponse('标签不存在', '404');
      }
      
      const updatedTag: Tag = {
        id,
        name: tag.name
      };
      
      mockTags[index] = updatedTag;
      
      return createSuccessResponse(updatedTag);
    } catch (error) {
      return createErrorResponse('更新标签失败');
    }
  },

  deleteTag: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockTags.findIndex(t => t.id === id);
      
      if (index === -1) {
        return createErrorResponse('标签不存在', '404');
      }
      
      mockTags.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('删除标签失败');
    }
  }
};

export const mockStatsApi = {
  getOverallStats: async (): Promise<BaseResponse<OverallStats>> => {
    await delay();
    
    try {
      return createSuccessResponse(mockStats);
    } catch (error) {
      return createErrorResponse('获取统计数据失败');
    }
  }
};
