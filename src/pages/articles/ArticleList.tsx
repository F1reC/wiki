import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  ThumbsUp, 
  Calendar
} from 'lucide-react';
import { articlesApi } from '../../services/api';
import { categoriesApi } from '../../services/api';
import { tagsApi } from '../../services/api';
import { Article, Category, Tag, PageInfo } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<PageInfo<Article>, 'list'>>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pages: 0,
    isFirstPage: true,
    isLastPage: false
  });
  
  const [tagId, setTagId] = useState<number | undefined>(undefined);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await articlesApi.getArticles({
        tagId,
        keyword,
        sort,
        order,
        page: pagination.pageNum,
        pageSize: pagination.pageSize
      });
      
      if (response.code === '200' && response.data) {
        setArticles(response.data.list);
        setPagination({
          pageNum: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.total,
          pages: response.data.pages,
          isFirstPage: response.data.isFirstPage,
          isLastPage: response.data.isLastPage
        });
      } else {
        setError(response.msg || 'Failed to fetch articles');
      }
    } catch (err) {
      setError('Error fetching articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagsApi.getTags({ pageSize: 100 });
      if (response.code === '200' && response.data) {
        const tagList = response.data.list;
        if (tagList) {
          setTags(tagList);
        } else {
          setTags([]);
          console.error('Failed to fetch tags: list not found in response data');
        }
      } else {
        console.error('Failed to fetch tags:', response.msg);
      }
    } catch (err) {
      console.error('Failed to fetch tags', err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, [pagination.pageNum, tagId, sort, order]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, pageNum: 1 }));
    fetchArticles();
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageNum: page }));
  };

  const handleTagChange = (value: string) => {
    setTagId(value === 'all-tags' ? undefined : parseInt(value));
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Article List</h1>
        <Link to="/articles/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search articles..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={handleSortChange} defaultValue={sort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created Time</SelectItem>
              <SelectItem value="updated_at">Updated Time</SelectItem>
              <SelectItem value="view_count">View Count</SelectItem>
              <SelectItem value="like_count">Like Count</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleOrderChange} defaultValue={order}>
            <SelectTrigger>
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tags</label>
                <Select onValueChange={handleTagChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-tags">All Tags</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Article list */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">No articles found</div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <Link to={`/articles/${article.id}`}>
                      <CardTitle className="hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{article.summary}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      {article.categoryName && (
                        <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                          {article.categoryName}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        {article.viewCount}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {article.likeCount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(article.createdAt)}
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {/* Pagination */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => !pagination.isFirstPage && handlePageChange(pagination.pageNum - 1)}
                      className={pagination.isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.pages || 
                      (page >= pagination.pageNum - 1 && page <= pagination.pageNum + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === pagination.pageNum}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => !pagination.isLastPage && handlePageChange(pagination.pageNum + 1)}
                      className={pagination.isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
