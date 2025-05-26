export interface BaseResponse<T> {
  code: string;
  msg: string;
  data: T | null;
}

export interface PageInfo<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
  list: T[];
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  categoryName?: string;
  authorId: number;
  authorName?: string;
  tagIds: number[];
  status: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCreationRequest {
  title: string;
  content: string;
  summary: string;
  categoryId: number;
  authorId: number;
  tagIds: number[];
  status: number;
}

export interface ArticleUpdateRequest {
  title: string;
  content: string;
  summary: string;
  categoryId: number;
  tagIds: number[];
  status: number;
}

export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  authorName?: string;
  content: string;
  parentId: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreationRequest {
  userId: number;
  content: string;
  parentId: number | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface OverallStats {
  articleCount: number;
  categoryCount: number;
  tagCount: number;
  viewCount: number;
  commentCount: number;
  userCount: number;
}

export interface LikeResult {
  message: string;
  likeCount: number;
}

export interface ViewResult {
  message: string;
  viewCount: number;
}
