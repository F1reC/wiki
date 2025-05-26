import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { articlesApi, categoriesApi, tagsApi } from '../../services/api';
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
  const [status, setStatus] = useState<string>('published'); // Explicitly string
  
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
        setStatus(String(article.status)); // Explicitly cast to string, though should be string type
      } else {
        setError(response.msg || 'Failed to fetch article details');
      }
    } catch (err) {
      setError('Error fetching article details');
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
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagsApi.getTags();
      if (response.code === '200' && response.data) {
        setTags(response.data.list);
      }
    } catch (err) {
      console.error('Failed to fetch tags', err);
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
      setError('Title cannot be empty');
      return false;
    }
    if (!content.trim()) {
      setError('Content cannot be empty');
      return false;
    }
    if (!summary.trim()) {
      setError('Summary cannot be empty');
      return false;
    }
    if (!categoryId) {
      setError('Please select a category');
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
          tag_ids: selectedTagIds,
          status: status, // status is already a string
        };
        
        const response = await articlesApi.updateArticle(parseInt(id), articleData);
        if (response.code === '200') {
          setSuccess('Article updated successfully');
          setTimeout(() => {
            navigate(`/articles/${id}`);
          }, 1500);
        } else {
          setError(response.msg || 'Failed to update article');
        }
      } else {
        const articleData: ArticleCreationRequest = {
          title,
          content,
          summary,
          categoryId: categoryId!,
          authorId: currentUserId,
          tag_ids: selectedTagIds,
          status: status, // status is already a string
        };
        
        const response = await articlesApi.createArticle(articleData);
        if (response.code === '200' && response.data) {
          const newArticleId = response.data.id;
          setSuccess('Article created successfully');
          setTimeout(() => {
            navigate(`/articles/${newArticleId}`);
          }, 1500);
        } else {
          setError(response.msg || 'Failed to create article');
        }
      }
    } catch (err) {
      setError('Error saving article');
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
    return <div className="container mx-auto py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Article' : 'Create Article'}</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
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
          <CardTitle>Article Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Enter article summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter article content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryId?.toString() || ''}
                onValueChange={(value) => setCategoryId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {/* The following SelectItem was originally in Chinese and is commented out as it might be a placeholder or unused 
                  <SelectItem value="placeholder" disabled>选择分类</SelectItem> 
                  */} 
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status.toString()} onValueChange={(value) => setStatus(String(value))}> 
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Published</SelectItem> 
                  <SelectItem value="0">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTagIds.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="font-normal">
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
            {saveLoading ? 'Saving...' : 'Save Article'} 
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArticleEdit;
