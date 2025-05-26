import { useEffect, useState, useRef } from 'react';
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

  const viewedArticleIdRef = useRef<string | null>(null);

  const currentUserId = 1;

  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await articlesApi.getArticleById(parseInt(id));
      if (response.code === '200' && response.data) {
        setArticle(response.data);
        if (viewedArticleIdRef.current !== id) {
          await articlesApi.viewArticle(parseInt(id));
          viewedArticleIdRef.current = id;
        }
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

  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const response = await commentsApi.getComments(parseInt(id));
      if (response.code === '200' && response.data) {
        setComments(response.data.list);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
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
        setLikeSuccess('Liked successfully!');
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
      console.error('Failed to like', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentContent.trim()) {
      setCommentError('Comment content cannot be empty');
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
        setCommentError(response.msg || 'Failed to submit comment');
      }
    } catch (err) {
      setCommentError('Error submitting comment');
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
      console.error('Failed to delete comment', err);
    }
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

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading...</div>;
  }

  if (error || !article) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Article not found'}</AlertDescription>
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
              Edit
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <span className="flex items-center mr-4">
            <User className="mr-1 h-4 w-4" />
            {article.authorName || `User ${article.authorId}`}
          </span>
          <span className="flex items-center mr-4">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(article.createdAt)}
          </span>
          <span className="flex items-center mr-4">
            <Eye className="mr-1 h-4 w-4" />
            {article.viewCount} Views
          </span>
          <span className="flex items-center">
            <ThumbsUp className="mr-1 h-4 w-4" />
            {article.likeCount} Likes
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
            Like
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Textarea
              placeholder="Write your comment..."
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
              Submit Comment
            </Button>
          </CardFooter>
        </Card>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No comments yet</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span className="font-medium">User {comment.userId}</span>
                    </div>
                    {comment.userId === currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
