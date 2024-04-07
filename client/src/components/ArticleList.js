import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import Comments from './Comments';
=======
import Comments from './CommentForm';
>>>>>>> e7623f4 (Modifications on all the code)

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/articles?page=${currentPage}&per_page=10`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data.articles || []);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        setError(error.message || 'Failed to fetch articles. Please try again later.');
        setLoading(false);
      });
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1>Article List</h1>
      {loading ? (
        <p>Loading...</p> // Consider using a loading indicator instead of plain text
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {articles.length > 0 ? (
            <div>
              {articles.map((article) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  <h2>{article.title}</h2>
                  <p>{article.body}</p>
                  <h3>Comments:</h3>
                  <Comments articleId={article.id} /> {/* Render Comments component for each article */}
                </div>
              ))}
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
            </div>
          ) : (
            <p>No articles found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticleList;