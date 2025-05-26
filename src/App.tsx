import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import './App.css';

import ArticleList from './pages/articles/ArticleList';
import ArticleDetail from './pages/articles/ArticleDetail';
import ArticleEdit from './pages/articles/ArticleEdit';
import CategoryList from './pages/categories/CategoryList';
import TagList from './pages/tags/TagList';
import Stats from './pages/stats/Stats';
import CommentManagement from './pages/comments/CommentManagement';
import IdentityManagement from './pages/identity/IdentityManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <ArticleList />
          </MainLayout>
        } />
        <Route path="/articles/:id" element={
          <MainLayout>
            <ArticleDetail />
          </MainLayout>
        } />
        <Route path="/articles/create" element={
          <MainLayout>
            <ArticleEdit />
          </MainLayout>
        } />
        <Route path="/articles/:id/edit" element={
          <MainLayout>
            <ArticleEdit />
          </MainLayout>
        } />
        <Route path="/categories" element={
          <MainLayout>
            <CategoryList />
          </MainLayout>
        } />
        <Route path="/tags" element={
          <MainLayout>
            <TagList />
          </MainLayout>
        } />
        <Route path="/comments" element={
          <MainLayout>
            <CommentManagement />
          </MainLayout>
        } />
        <Route path="/stats" element={
          <MainLayout>
            <Stats />
          </MainLayout>
        } />
        <Route path="/identity" element={
          <MainLayout>
            <IdentityManagement />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
