import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag as TagIcon,
  Save
} from 'lucide-react';
import { tagsApi } from '../../services/api';
import { Tag } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';

const TagList = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  
  const [keyword, setKeyword] = useState('');
  
  const [page, setPage] = useState(1);
  const pageSize = 10; // Fixed value, no need for state
  const [totalPages, setTotalPages] = useState(0);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagsApi.getTags({
        keyword,
        page,
        pageSize
      });
      
      if (response.code === '200' && response.data) {
        setTags(response.data.list);
        setTotalPages(response.data.pages);
      } else {
        setError(response.msg || '获取标签列表失败');
      }
    } catch (err) {
      setError('获取标签列表时发生错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [page, pageSize]);

  const resetForm = () => {
    setName('');
    setIsEditing(false);
    setEditingId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: Tag) => {
    setIsEditing(true);
    setEditingId(tag.id);
    setName(tag.name);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('标签名称不能为空');
      return;
    }

    try {
      const tagData: Tag = {
        id: isEditing ? editingId! : 0,
        name
      };

      let response;
      if (isEditing) {
        response = await tagsApi.updateTag(editingId!, tagData);
      } else {
        response = await tagsApi.createTag(tagData);
      }

      if (response.code === '200') {
        setSuccess(isEditing ? '标签更新成功' : '标签创建成功');
        setIsDialogOpen(false);
        fetchTags();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.msg || (isEditing ? '更新标签失败' : '创建标签失败'));
      }
    } catch (err) {
      setError('保存标签时发生错误');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？')) return;

    try {
      const response = await tagsApi.deleteTag(id);
      if (response.code === '200') {
        setSuccess('标签删除成功');
        fetchTags();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.msg || '删除标签失败');
      }
    } catch (err) {
      setError('删除标签时发生错误');
      console.error(err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchTags();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新建标签
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

      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="搜索标签..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>搜索</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>标签列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无标签</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TagIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {tag.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(tag)}
                        className="mr-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => page > 1 && handlePageChange(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      size="default"
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => 
                      p === 1 || 
                      p === totalPages || 
                      (p >= page - 1 && p <= page + 1)
                    )
                    .map((p, index, array) => (
                      <React.Fragment key={p}>
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(p)}
                            isActive={p === page}
                            size="default"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => page < totalPages && handlePageChange(page + 1)}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      size="default"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑标签' : '新建标签'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                placeholder="请输入标签名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagList;
