// src/types.ts

// 通用后端响应结构
export interface BaseResponse<TData> {
  code: string;
  msg: string;
  data: TData | null;
}

// 分页信息结构
export interface PageInfo<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
  list: T[];      // 通常用于文章列表等
  records?: T[]; // 用于兼容后端可能返回 'records' 的情况 (如分类、标签)
  isFirstPage: boolean;
  isLastPage: boolean;
}

// 文章类型 - 请根据你的后端 ArticleVO 结构进行调整和完善
export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string; // 完整内容可能在详情页才加载
  categoryId: number;
  categoryName?: string;
  authorId?: number;
  authorName?: string;
  tagIds?: number[]; // 假设是 ID 列表
  status: string; // published, draft etc.
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

// 分类类型 - 请根据你的后端 KnowledgeCategory 结构进行调整和完善
export interface Category {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
}

// 标签类型 - 请根据你的后端 KnowledgeTag 结构进行调整和完善
export interface Tag {
  id: number;
  name: string;
}

// Chat API 响应类型
export type ChatResponse = string;

// 文章创建请求类型
export interface ArticleCreationRequest {
  title: string;
  content: string;
  summary: string;
  categoryId: number;
  tag_ids?: number[]; // API expects tag_ids
  authorId: number; // Assuming authorId is required for creation
  status: string; // e.g., "published", "draft"
}

// 文章更新请求类型
export interface ArticleUpdateRequest {
  title: string;
  content: string;
  summary: string;
  categoryId: number;
  tag_ids?: number[]; // API expects tag_ids
  status: string; // e.g., "published", "draft"
}

// 你可以根据需要在此文件中添加其他类型定义，例如：
// export interface ArticleCreationRequest { ... }
// export interface Comment { ... } 