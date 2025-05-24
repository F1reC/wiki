import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { articlesApiWithFallback as articlesApi, categoriesApiWithFallback as categoriesApi, tagsApiWithFallback as tagsApi } from '../../services/apiWithFallback';
import { Category, Tag, ArticleCreationRequest, ArticleUpdateRequest } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';

const ArticleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [status, setStatus] = useState(1); // 1 = published, 0 = draft
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentUserId = 1;

  const fetchArticle = async () => {
    if (!isEditing) return;
    
    setLoading(true);
    try {
      const response = await articlesApi.getArticleById(parseInt(id));
      if (response.code === '200' && response.data) {
        const article = response.data;
        setTitle(article.title);
        setContent(article.content);
        setSummary(article.summary);
        setCategoryId(article.categoryId);
        setSelectedTagIds(article.tagIds || []);
        setStatus(article.status);
      } else {
        setError(response.msg || '获取文章详情失败');
      }
    } catch (err) {
      setError('获取文章详情时发生错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.code === '200' && response.data) {
        setCategories(response.data.list);
      }
    } catch (err) {
      console.error('获取分类列表失败', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagsApi.getTags();
      if (response.code === '200' && response.data) {
        setTags(response.data.list);
      }
    } catch (err) {
      console.error('获取标签列表失败', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('标题不能为空');
      return false;
    }
    if (!content.trim()) {
      setError('内容不能为空');
      return false;
    }
    if (!summary.trim()) {
      setError('摘要不能为空');
      return false;
    }
    if (!categoryId) {
      setError('请选择分类');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaveLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        const articleData: ArticleUpdateRequest = {
          title,
          content,
          summary,
          categoryId: categoryId!,
          tagIds: selectedTagIds,
          status
        };
        
        const response = await articlesApi.updateArticle(parseInt(id), articleData);
        if (response.code === '200') {
          setSuccess('文章更新成功');
          setTimeout(() => {
            navigate(`/articles/${id}`);
          }, 1500);
        } else {
          setError(response.msg || '更新文章失败');
        }
      } else {
        const articleData: ArticleCreationRequest = {
          title,
          content,
          summary,
          categoryId: categoryId!,
          authorId: currentUserId,
          tagIds: selectedTagIds,
          status
        };
        
        const response = await articlesApi.createArticle(articleData);
        if (response.code === '200' && response.data) {
          const newArticleId = response.data.id;
          setSuccess('文章创建成功');
          setTimeout(() => {
            navigate(`/articles/${newArticleId}`);
          }, 1500);
        } else {
          setError(response.msg || '创建文章失败');
        }
      }
    } catch (err) {
      setError('保存文章时发生错误');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">加载中...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? '编辑文章' : '创建文章'}</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>文章信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="请输入文章标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">摘要</Label>
            <Textarea
              id="summary"
              placeholder="请输入文章摘要"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              placeholder="请输入文章内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select
                value={categoryId?.toString() || ''}
                onValueChange={(value) => setCategoryId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>选择分类</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={status.toString()}
                onValueChange={(value) => setStatus(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status-placeholder" disabled>选择状态</SelectItem>
                  <SelectItem value="1">已发布</SelectItem>
                  <SelectItem value="0">草稿</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTagIds.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={saveLoading}>
            <Save className="mr-2 h-4 w-4" />
            {saveLoading ? '保存中...' : '保存文章'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArticleEdit;
