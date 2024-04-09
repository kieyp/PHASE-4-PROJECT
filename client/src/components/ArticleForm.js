import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './ArticleForm.css';

const ArticleForm = () => {
  const [authorDetails, setAuthorDetails] = useState(null);
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(5); // Number of articles per page
  const [editingArticleId, setEditingArticleId] = useState(null); // State to track which article is being edited
  const history = useHistory();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authorResponse = await axios.get('/author-details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuthorDetails(authorResponse.data);

      const articlesResponse = await axios.get('/articles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userArticles = articlesResponse.data.articles.filter(
        (article) => article.authorId === authorResponse.data.id
      );
      setArticles(userArticles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (editingArticleId) {
        await axios.put(`/articles/${editingArticleId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingArticleId(null); // Reset editing state
      } else {
        await axios.post('/articles', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ title: '', body: '' });
      fetchData();
    } catch (error) {
      console.error('Article creation failed:', error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  const handleEdit = (articleId) => {
    const articleToEdit = articles.find((article) => article.id === articleId);
    setFormData({ title: articleToEdit.title, body: articleToEdit.body });
    setEditingArticleId(articleId);
  };

  const handleDelete = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Article deletion failed:', error.response.data);
    }
  };

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      {editingArticleId ? (
        // Render article form for editing
        <div>
          <h2>Edit Article</h2>
          <form onSubmit={handleSubmit} className="article-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title:</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="body" className="form-label">Body:</label>
              <textarea id="body" name="body" value={formData.body} onChange={handleChange} className="form-textarea" required />
            </div>
            <div className="button-group">
              <button type="submit" className={`submit-button ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setEditingArticleId(null)} className="cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        // Render articles list
        <div>
          <h2>Write Article</h2>
          {/* Author details */}
          {authorDetails && (
            <div className="author-details">
              <p><strong>Username:</strong> {authorDetails.username}</p>
              <p><strong>Location:</strong> {authorDetails.location}</p>
              <p><strong>Full Name:</strong> {authorDetails.fullName}</p>
              <p><strong>Bio:</strong> {authorDetails.bio}</p>
            </div>
          )}

          {/* Article form */}
          <form onSubmit={handleSubmit} className="article-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title:</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="form-input title-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="body" className="form-label">Body:</label>
              <textarea id="body" name="body" value={formData.body} onChange={handleChange} className="form-textarea" required />
            </div>
            <div className="button-group">
              <button type="submit" className={`submit-button ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </form>

          {/* Display paginated articles */}
          <h2>Articles</h2>
          <ul>
            {currentArticles.map((article) => (
              <li key={article.id}>
                <h3>{article.title}</h3>
                <p>{article.body}</p>
                <button onClick={() => handleEdit(article.id)}>Edit</button>
                <button onClick={() => handleDelete(article.id)}>Delete</button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <ul className="pagination">
            {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, i) => (
              <li key={i + 1}>
                <button onClick={() => paginate(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticleForm;
