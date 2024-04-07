import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogArticle = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/articleslist');
      const articlesData = response.data;
      setArticles(articlesData.slice(0, 5)); // Limit articles to 5 rows
      setLoading(false);
      setError(null); // Clear error if fetching is successful
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">All Articles</h1>
      {loading && <p>Loading articles...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && (
        <div className="article-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <h2 className="article-title">{article.title}</h2>
              <p className="article-body">{article.body}</p>
              {article.comments && article.comments.length > 0 && (
                <>
                  <h3 className="comments-title">Comments:</h3>
                  <ul className="comment-list">
                    {article.comments.map((comment) => (
                      <li key={comment.id} className="comment-item">
                        <strong className="comment-user">{comment.user.name}</strong>: {comment.text} {/* Display only commenter's name */}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogArticle;
