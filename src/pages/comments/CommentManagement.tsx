import React, { useEffect, useState, useCallback } from 'react';
import { commentsApi } from '../../services/api';
import { Comment, PageInfo, CommentStatusUpdateRequest } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';

const CommentManagement: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Or make it configurable
  const [totalPages, setTotalPages] = useState(0);

  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterKeyword, setFilterKeyword] = useState<string>('');

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentsApi.getAllComments({
        page,
        pageSize,
        status: filterStatus || undefined,
        keyword: filterKeyword || undefined,
      });
      if (response.code === '200' && response.data) {
        setComments(response.data.list || []);
        setTotalPages(response.data.pages || 0);
      } else {
        setError(response.msg || 'Failed to fetch comments');
        setComments([]);
        setTotalPages(0);
      }
    } catch (err) {
      setError('Error fetching comments');
      setComments([]);
      setTotalPages(0);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus, filterKeyword]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (commentId: number) => {
    setError(null);
    setSuccess(null);
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const response = await commentsApi.deleteComment(commentId);
      if (response.code === '200') {
        setSuccess('Comment deleted successfully');
        fetchComments(); // Refresh list
      } else {
        setError(response.msg || 'Failed to delete comment');
      }
    } catch (err) {
      setError('Error deleting comment');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (commentId: number, status: CommentStatusUpdateRequest['status']) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await commentsApi.updateCommentStatus(commentId, status);
      if (response.code === '200') {
        setSuccess(`Comment status updated to ${status}`);
        // Optimistically update local state or refetch
        // For mock, refetching is fine
        fetchComments();
      } else {
        setError(response.msg || 'Failed to update comment status');
      }
    } catch (err) {
      setError('Error updating comment status');
      console.error(err);
    }
  };
  
  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchComments();
  };

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Comment Management</h1>

      {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert className="mb-4"><AlertDescription>{success}</AlertDescription></Alert>}

      <div className="flex flex-wrap gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex-grow min-w-[200px]">
            <Label htmlFor="keyword-filter" className="text-sm font-medium">Keyword</Label>
            <Input
                id="keyword-filter"
                placeholder="Search content or author..."
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                className="mt-1"
            />
        </div>
        <div className="flex-grow min-w-[150px]">
            <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
            <Select value={filterStatus} onValueChange={(value) => { setFilterStatus(value === 'all' ? '' : value); setPage(1); }}>
                <SelectTrigger id="status-filter" className="mt-1">
                    <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="self-end">
            <Button onClick={handleSearch} className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" /> Search / Refresh
            </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No comments found.</p>
      ) : (
        <>
          <Table className="bg-white shadow rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Content</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Article ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium max-w-xs truncate" title={comment.content}>{comment.content}</TableCell>
                  <TableCell>{comment.authorName || `User ${comment.userId}`}</TableCell>
                  <TableCell>{comment.articleId}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(comment.status)}>{comment.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(comment.createdAt)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {comment.status !== 'approved' && (
                      <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(comment.id, 'approved')} className="text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                    )}
                    {comment.status !== 'rejected' && (
                      <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(comment.id, 'rejected')} className="text-red-600 border-red-600 hover:bg-red-50">
                        <XCircle className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(comment.id)} className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} className={page === 1 ? "pointer-events-none opacity-50" : undefined}/>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                    <PaginationItem key={pNum}>
                      <PaginationLink onClick={() => setPage(pNum)} isActive={pNum === page}>
                        {pNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} className={page === totalPages ? "pointer-events-none opacity-50" : undefined}/>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentManagement; 