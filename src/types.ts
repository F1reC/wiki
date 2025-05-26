// src/types.ts

// 通用后端响应结构
export interface BaseResponse<T> {
  code: string;
  msg: string;
  data: T | null;
}

// 分页信息结构
export interface PageInfo<T> {
  list: T[];
  total: number;
  pageNum: number;    // current page number
  pageSize: number;   // items per page
  size: number;       // actual number of items in the current list for this page
  pages: number;      // total pages
  isFirstPage?: boolean;
  isLastPage?: boolean;
  // Fields that might come from an API and get mapped (e.g. in CommentPageInfo)
  records?: T[];
  current?: number;
}

// 文章类型 - 请根据你的后端 ArticleVO 结构进行调整和完善
export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  categoryId?: number;
  categoryName?: string;
  authorId?: number;
  authorName?: string;
  authorAvatar?: string | null;
  status?: 'draft' | 'published' | 'archived' | string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  isTop?: number | boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[] | null;
}

// 分类类型 - 请根据你的后端 KnowledgeCategory 结构进行调整和完善
export interface Category {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[]; 
}

// 标签类型 - 请根据你的后端 KnowledgeTag 结构进行调整和完善
export interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Chat API 响应类型
export type ChatResponse = string;

// 文章创建请求类型
export interface ArticleCreationRequest {
  title: string;
  content: string;
  summary?: string;
  categoryId: number; 
  tag_ids?: number[];
  authorId?: number; // This might be set by the backend based on auth
  status: 'draft' | 'published' | string;
}

// 文章更新请求类型
export interface ArticleUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: number;
  tag_ids?: number[];
  status?: 'draft' | 'published' | 'archived' | string;
  isTop?: boolean;
}

// 评论接口特定的分页信息结构 (根据实际API响应)
export interface CommentPageInfoFromAPI {
  records: Comment[];
  total: number;
  size: number;       // This 'size' from API means page_size
  current: number;
  pages: number;
}

// This is the type that will be used by components after mapping in api.ts
// It references the generic PageInfo<T>
export type CommentPageInfo = PageInfo<Comment>;

// 整体统计数据类型 (占位定义，请根据实际API调整)
export interface OverallStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  articlesPublished: number;
  articlesInDraft: number;
  commentsPending: number;
  commentsApproved: number;
  // Add other stats properties as needed
}

// 评论类型 - 请根据后端实际返回调整
export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  authorName: string; // Ensured: Linter expects this
  content: string;
  parentId?: number | null;
  status: 'pending' | 'approved' | 'rejected' | string; // Ensured: Linter expects this
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
}

// 评论创建请求类型
export interface CommentCreationRequest {
  content: string;
  parentId?: number | null;
  // articleId is usually part of the URL path
  // userId is usually inferred from auth by backend
}

// 评论状态更新请求类型 (假设)
export interface CommentStatusUpdateRequest {
  status: 'approved' | 'rejected' | string;
}

// 点赞操作结果 (如果API有特定返回)
export interface LikeResult {
  message: string;
  likeCount: number;
}

// 浏览操作结果 (如果API有特定返回)
export interface ViewResult {
  message: string;
  viewCount: number;
}

// Category Types
export interface CategoryPageInfo extends PageInfo<Category> {}

export interface CategoryCreationRequest {
  name: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
}

export interface TagPageInfo extends PageInfo<Tag> {}

// 你可以根据需要在此文件中添加其他类型定义，例如：
// export interface ArticleCreationRequest { ... }
// export interface Comment { ... } 