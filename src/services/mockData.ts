import { Article, Category, Tag, Comment, OverallStats, PageInfo } from '../types';

export const mockArticles: Article[] = [
  {
    id: 1,
    title: '如何处理退款申请',
    summary: '本文介绍了处理客户退款申请的标准流程和注意事项。',
    content: '当收到客户退款申请时，首先需要验证订单信息，然后按照公司政策评估退款理由。如果符合退款条件，应在48小时内处理退款并通知客户。处理过程中应保持礼貌和专业，确保客户满意度。',
    categoryId: 1,
    categoryName: '订单管理',
    authorId: 1,
    authorName: '张三',
    tagIds: [1, 2],
    status: 1,
    viewCount: 150,
    likeCount: 30,
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T11:00:00Z'
  },
  {
    id: 2,
    title: '客户投诉处理指南',
    summary: '本文提供了有效处理客户投诉的方法和技巧。',
    content: '处理客户投诉是提升服务质量的重要环节。首先，认真倾听客户的问题并表示理解；其次，分析问题根源并提出解决方案；最后，跟进问题解决情况并收集客户反馈。良好的投诉处理可以将不满客户转变为忠诚客户。',
    categoryId: 2,
    categoryName: '客户服务',
    authorId: 2,
    authorName: '李四',
    tagIds: [3, 4],
    status: 1,
    viewCount: 200,
    likeCount: 45,
    createdAt: '2023-10-27T09:00:00Z',
    updatedAt: '2023-10-27T10:00:00Z'
  },
  {
    id: 3,
    title: '产品质量检查标准',
    summary: '详细介绍了产品质量检查的标准流程和关键指标。',
    content: '产品质量检查是确保产品符合标准的关键步骤。检查应包括外观、功能、安全性和耐久性等方面。每个环节都有具体的检查标准和合格要求。质检人员需要严格按照标准执行，并详细记录检查结果。',
    categoryId: 3,
    categoryName: '质量控制',
    authorId: 1,
    authorName: '张三',
    tagIds: [5],
    status: 1,
    viewCount: 120,
    likeCount: 25,
    createdAt: '2023-10-28T11:00:00Z',
    updatedAt: '2023-10-28T12:00:00Z'
  }
];

export const mockCategories: Category[] = [
  {
    id: 1,
    name: '订单管理',
    description: '关于订单处理、退款等相关知识',
    parentId: null,
    sortOrder: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '客户服务',
    description: '客户沟通、投诉处理等服务指南',
    parentId: null,
    sortOrder: 20,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: '质量控制',
    description: '产品质量标准和检查流程',
    parentId: null,
    sortOrder: 30,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: '退款流程',
    description: '详细的退款处理步骤',
    parentId: 1,
    sortOrder: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export const mockTags: Tag[] = [
  { id: 1, name: '退款', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 2, name: '订单处理', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 3, name: '客户投诉', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 4, name: '服务质量', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: 5, name: '质量标准', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' }
];

export const mockComments: Comment[] = [
  {
    id: 1,
    articleId: 1,
    userId: 2,
    authorName: 'Mock User 2',
    content: '这篇文章非常实用，帮助我解决了退款处理的问题。',
    parentId: null,
    status: 'approved',
    createdAt: '2023-10-26T15:00:00Z',
    updatedAt: '2023-10-26T15:00:00Z'
  },
  {
    id: 2,
    articleId: 1,
    userId: 3,
    authorName: 'Mock User 3',
    content: '我认为还可以补充一些特殊情况的处理方法。',
    parentId: 1,
    status: 'approved',
    createdAt: '2023-10-26T16:00:00Z',
    updatedAt: '2023-10-26T16:00:00Z'
  },
  {
    id: 3,
    articleId: 2,
    userId: 1,
    authorName: 'Mock User 1',
    content: '这些投诉处理技巧非常有帮助，已经在团队中分享了。',
    parentId: null,
    status: 'approved',
    createdAt: '2023-10-27T14:00:00Z',
    updatedAt: '2023-10-27T14:00:00Z'
  }
];

export const mockStats: OverallStats = {
  articleCount: 28,
  categoryCount: 5,
  tagCount: 16,
  viewCount: 470,
  commentCount: 3,
  userCount: 10
};

export function createPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PageInfo<T> {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);
  const total = items.length;
  const pages = Math.ceil(total / pageSize);
  
  return {
    pageNum: page,
    pageSize,
    total,
    pages,
    list: paginatedItems,
    isFirstPage: page === 1,
    isLastPage: page === pages || pages === 0
  };
}

export function filterArticles(
  articles: Article[],
  filters: {
    categoryId?: number;
    tagId?: number;
    keyword?: string;
    sort?: string;
    order?: string;
  }
): Article[] {
  let filtered = [...articles];
  
  if (filters.categoryId) {
    filtered = filtered.filter(article => article.categoryId === filters.categoryId);
  }
  
  if (filters.tagId) {
    filtered = filtered.filter(article => article.tagIds.includes(filters.tagId as number));
  }
  
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      article => 
        article.title.toLowerCase().includes(keyword) || 
        article.summary.toLowerCase().includes(keyword) ||
        article.content.toLowerCase().includes(keyword)
    );
  }
  
  const sortField = filters.sort || 'createdAt';
  const sortOrder = filters.order === 'asc' ? 1 : -1;
  
  filtered.sort((a, b) => {
    const valueA = a[sortField as keyof Article];
    const valueB = b[sortField as keyof Article];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder * valueA.localeCompare(valueB);
    }
    
    return sortOrder * (Number(valueA) - Number(valueB));
  });
  
  return filtered;
}
