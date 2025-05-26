import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Edit, 
  ThumbsUp, 
  Eye, 
  Calendar, 
  User, 
  Send, 
  Trash2 
} from 'lucide-react';
import { articlesApi, commentsApi } from '../../services/api';
import { Article, Comment } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [likeSuccess, setLikeSuccess] = useState<string | null>(null);

  const currentUserId = 1;

  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await articlesApi.getArticleById(parseInt(id));
      if (response.code === '200' && response.data) {
        setArticle(response.data);
        await articlesApi.viewArticle(parseInt(id));
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

  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const response = await commentsApi.getComments(parseInt(id));
      if (response.code === '200' && response.data) {
        setComments(response.data.list);
      }
    } catch (err) {
      console.error('获取评论列表失败', err);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!id) return;
    
    try {
      const response = await articlesApi.likeArticle(parseInt(id));
      if (response.code === '200' && response.data) {
        setLikeSuccess('点赞成功！');
        if (article) {
          setArticle({
            ...article,
            likeCount: response.data.likeCount
          });
        }
        
        setTimeout(() => {
          setLikeSuccess(null);
        }, 3000);
      }
    } catch (err) {
      console.error('点赞失败', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentContent.trim()) {
      setCommentError('评论内容不能为空');
      return;
    }
    
    try {
      const response = await commentsApi.createComment(parseInt(id), {
        userId: currentUserId,
        content: commentContent,
        parentId: null
      });
      
      if (response.code === '200' && response.data) {
        setCommentContent('');
        setCommentError(null);
        fetchComments();
      } else {
        setCommentError(response.msg || '提交评论失败');
      }
    } catch (err) {
      setCommentError('提交评论时发生错误');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await commentsApi.deleteComment(commentId);
      if (response.code === '200') {
        fetchComments();
      }
    } catch (err) {
      console.error('删除评论失败', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">加载中...</div>;
  }

  if (error || !article) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || '文章不存在'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <Link to={`/articles/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <span className="flex items-center mr-4">
            <User className="mr-1 h-4 w-4" />
            {article.authorName || `用户 ${article.authorId}`}
          </span>
          <span className="flex items-center mr-4">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(article.createdAt)}
          </span>
          <span className="flex items-center mr-4">
            <Eye className="mr-1 h-4 w-4" />
            {article.viewCount} 浏览
          </span>
          <span className="flex items-center">
            <ThumbsUp className="mr-1 h-4 w-4" />
            {article.likeCount} 点赞
          </span>
        </div>
        
        {article.categoryName && (
          <div className="mt-2">
            <Badge variant="outline">{article.categoryName}</Badge>
          </div>
        )}
      </div>

      {likeSuccess && (
        <Alert className="mb-4">
          <AlertDescription>{likeSuccess}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div></div>
          <Button onClick={handleLike} variant="outline">
            <ThumbsUp className="mr-2 h-4 w-4" />
            点赞
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">评论 ({comments.length})</h2>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Textarea
              placeholder="写下你的评论..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="mb-2"
            />
            {commentError && (
              <p className="text-red-500 text-sm mb-2">{commentError}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmitComment}>
              <Send className="mr-2 h-4 w-4" />
              提交评论
            </Button>
          </CardFooter>
        </Card>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无评论</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span className="font-medium">用户 {comment.userId}</span>
                    </div>
                    {comment.userId === currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{comment.content}</p>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(comment.createdAt)}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
