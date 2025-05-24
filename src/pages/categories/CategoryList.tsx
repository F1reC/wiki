import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save
} from 'lucide-react';
import { categoriesApiWithFallback as categoriesApi } from '../../services/apiWithFallback';
import { Category } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState(100);
  
  const [page, setPage] = useState(1);
  const pageSize = 10; // Fixed value, no need for state
  const [totalPages, setTotalPages] = useState(0);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getCategories({
        page,
        pageSize
      });
      
      if (response.code === '200' && response.data) {
        setCategories(response.data.list);
        setTotalPages(response.data.pages);
      } else {
        setError(response.msg || '获取分类列表失败');
      }
    } catch (err) {
      setError('获取分类列表时发生错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, pageSize]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setParentId(null);
    setSortOrder(100);
    setIsEditing(false);
    setEditingId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setIsEditing(true);
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setParentId(category.parentId);
    setSortOrder(category.sortOrder);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('分类名称不能为空');
      return;
    }

    try {
      const categoryData: Category = {
        id: isEditing ? editingId! : 0,
        name,
        description,
        parentId,
        sortOrder
      };

      let response;
      if (isEditing) {
        response = await categoriesApi.updateCategory(editingId!, categoryData);
      } else {
        response = await categoriesApi.createCategory(categoryData);
      }

      if (response.code === '200') {
        setSuccess(isEditing ? '分类更新成功' : '分类创建成功');
        setIsDialogOpen(false);
        fetchCategories();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.msg || (isEditing ? '更新分类失败' : '创建分类失败'));
      }
    } catch (err) {
      setError('保存分类时发生错误');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;

    try {
      const response = await categoriesApi.deleteCategory(id);
      if (response.code === '200') {
        setSuccess('分类删除成功');
        fetchCategories();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.msg || '删除分类失败');
      }
    } catch (err) {
      setError('删除分类时发生错误');
      console.error(err);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getCategoryName = (id: number | null) => {
    if (!id) return '无';
    const category = categories.find(c => c.id === id);
    return category ? category.name : '未知分类';
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新建分类
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
          <CardTitle>分类列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无分类</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>父分类</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>{getCategoryName(category.parentId)}</TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                        className="mr-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
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
            <DialogTitle>{isEditing ? '编辑分类' : '新建分类'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                placeholder="请输入分类名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                placeholder="请输入分类描述"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentId">父分类</Label>
              <Select
                value={parentId?.toString() || ''}
                onValueChange={(value) => setParentId(value === 'no-parent' ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择父分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-parent">无</SelectItem>
                  {categories
                    .filter(c => !isEditing || c.id !== editingId) // Prevent selecting self as parent
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">排序</Label>
              <Input
                id="sortOrder"
                type="number"
                placeholder="请输入排序值"
                value={sortOrder.toString()}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
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

export default CategoryList;
