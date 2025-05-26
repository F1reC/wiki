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
    msg: 'Operation successful',
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
      return createErrorResponse('Failed to fetch articles');
    }
  },

  getArticleById: async (id: number): Promise<BaseResponse<Article>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        return createErrorResponse('Article not found', '404');
      }
      
      return createSuccessResponse(article);
    } catch (error) {
      return createErrorResponse('Failed to fetch article details');
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
        authorName: 'Current User',
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
      return createErrorResponse('Failed to create article');
    }
  },

  updateArticle: async (id: number, article: ArticleUpdateRequest): Promise<BaseResponse<Article>> => {
    await delay();
    
    try {
      const index = mockArticles.findIndex(a => a.id === id);
      
      if (index === -1) {
        return createErrorResponse('Article not found', '404');
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
      return createErrorResponse('Failed to update article');
    }
  },

  deleteArticle: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockArticles.findIndex(a => a.id === id);
      
      if (index === -1) {
        return createErrorResponse('Article not found', '404');
      }
      
      mockArticles.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('Failed to delete article');
    }
  },

  likeArticle: async (id: number): Promise<BaseResponse<LikeResult>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        return createErrorResponse('Article not found', '404');
      }
      
      article.likeCount += 1;
      
      return createSuccessResponse({
        message: 'Liked successfully',
        likeCount: article.likeCount
      });
    } catch (error) {
      return createErrorResponse('Failed to like');
    }
  },

  viewArticle: async (id: number): Promise<BaseResponse<ViewResult>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        return createErrorResponse('Article not found', '404');
      }
      
      article.viewCount += 1;
      
      return createSuccessResponse({
        message: 'View recorded successfully',
        viewCount: article.viewCount
      });
    } catch (error) {
      return createErrorResponse('Failed to record view');
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
      return createErrorResponse('Failed to fetch comments');
    }
  },

  createComment: async (articleId: number, comment: CommentCreationRequest): Promise<BaseResponse<Comment>> => {
    await delay();
    
    try {
      const article = mockArticles.find(a => a.id === articleId);
      
      if (!article) {
        return createErrorResponse('Article not found', '404');
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
      return createErrorResponse('Failed to create comment');
    }
  },

  deleteComment: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockComments.findIndex(c => c.id === id);
      
      if (index === -1) {
        return createErrorResponse('Comment not found', '404');
      }
      
      mockComments.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('Failed to delete comment');
    }
  },
  
  updateCommentStatus: async (id: number, status: string): Promise<BaseResponse<Comment>> => {
    await delay();
    try {
        const comment = mockComments.find(c => c.id === id);
        if (!comment) {
            return createErrorResponse('Comment not found', '404');
        }
        comment.status = status;
        comment.updatedAt = new Date().toISOString();
        return createSuccessResponse(comment);
    } catch (error) {
        return createErrorResponse('Failed to update comment status');
    }
  },

  getAllComments: async (params?: { page?: number; pageSize?: number, status?: string, keyword?: string }): Promise<BaseResponse<PageInfo<Comment>>> => {
    await delay();
    
    try {
      const filteredComments = mockComments.filter(c => 
        (params?.status ? c.status === params.status : true) &&
        (params?.keyword ? c.content.toLowerCase().includes(params.keyword.toLowerCase()) : true)
      );
      
      const paginatedData = createPaginatedResponse(
        filteredComments,
        params?.page || 1,
        params?.pageSize || 10
      );
      
      return createSuccessResponse(paginatedData);
    } catch (error) {
      return createErrorResponse('Failed to fetch comments');
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
      return createErrorResponse('Failed to fetch categories');
    }
  },

  getCategoryById: async (id: number): Promise<BaseResponse<Category>> => {
    await delay();
    
    try {
      const category = mockCategories.find(c => c.id === id);
      
      if (!category) {
        return createErrorResponse('Category not found', '404');
      }
      
      return createSuccessResponse(category);
    } catch (error) {
      return createErrorResponse('Failed to fetch category details');
    }
  },

  createCategory: async (category: Partial<Category>): Promise<BaseResponse<Category>> => {
    await delay();
    
    try {
      const newId = Math.max(...mockCategories.map(c => c.id)) + 1;
      
      const newCategory: Category = {
        id: newId,
        name: category.name || '',
        description: category.description || '',
        parentId: category.parentId || null,
        sortOrder: category.sortOrder || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockCategories.push(newCategory);
      
      return createSuccessResponse(newCategory);
    } catch (error) {
      return createErrorResponse('Failed to create category');
    }
  },

  updateCategory: async (id: number, category: Partial<Category>): Promise<BaseResponse<Category>> => {
    await delay();
    
    try {
      const index = mockCategories.findIndex(c => c.id === id);
      
      if (index === -1) {
        return createErrorResponse('Category not found', '404');
      }
      
      const updatedCategory = { ...mockCategories[index], ...category, updatedAt: new Date().toISOString() };
      mockCategories[index] = updatedCategory as Category;
      
      return createSuccessResponse(updatedCategory as Category);
    } catch (error) {
      return createErrorResponse('Failed to update category');
    }
  },

  deleteCategory: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockCategories.findIndex(c => c.id === id);
      
      if (index === -1) {
        return createErrorResponse('Category not found', '404');
      }
      
      const hasChildren = mockCategories.some(c => c.parentId === id);
      
      if (hasChildren) {
        return createErrorResponse('存在子分类，不能删除', '400');
      }
      
      mockCategories.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('Failed to delete category');
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
      return createErrorResponse('Failed to fetch tags');
    }
  },

  getTagById: async (id: number): Promise<BaseResponse<Tag>> => {
    await delay();
    
    try {
      const tag = mockTags.find(t => t.id === id);
      
      if (!tag) {
        return createErrorResponse('Tag not found', '404');
      }
      
      return createSuccessResponse(tag);
    } catch (error) {
      return createErrorResponse('Failed to fetch tag details');
    }
  },

  createTag: async (tag: Partial<Tag>): Promise<BaseResponse<Tag>> => {
    await delay();
    
    try {
      const newId = Math.max(...mockTags.map(t => t.id)) + 1;
      
      const newTag: Tag = {
        id: newId,
        name: tag.name || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockTags.push(newTag);
      
      return createSuccessResponse(newTag);
    } catch (error) {
      return createErrorResponse('Failed to create tag');
    }
  },

  updateTag: async (id: number, tag: Partial<Tag>): Promise<BaseResponse<Tag>> => {
    await delay();
    
    try {
      const index = mockTags.findIndex(t => t.id === id);
      
      if (index === -1) {
        return createErrorResponse('Tag not found', '404');
      }
      
      const updatedTag = { ...mockTags[index], ...tag, updatedAt: new Date().toISOString() };
      mockTags[index] = updatedTag as Tag;
      
      return createSuccessResponse(updatedTag as Tag);
    } catch (error) {
      return createErrorResponse('Failed to update tag');
    }
  },

  deleteTag: async (id: number): Promise<BaseResponse<null>> => {
    await delay();
    
    try {
      const index = mockTags.findIndex(t => t.id === id);
      
      if (index === -1) {
        return createErrorResponse('Tag not found', '404');
      }
      
      mockTags.splice(index, 1);
      
      return createSuccessResponse(null);
    } catch (error) {
      return createErrorResponse('Failed to delete tag');
    }
  }
};

export const mockStatsApi = {
  getOverallStats: async (): Promise<BaseResponse<OverallStats>> => {
    await delay();
    
    try {
      return createSuccessResponse(mockStats);
    } catch (error) {
      return createErrorResponse('Failed to fetch statistics');
    }
  }
};
