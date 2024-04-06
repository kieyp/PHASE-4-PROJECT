import React, { useState, useEffect } from 'react';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/articles?page=${currentPage}&per_page=10`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
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
        <p>Loading...</p>
      ) : (
        <div>
          {articles.length > 0 ? (
            <div>
              {articles.map((article) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  <h2>{article.title}</h2>
                  <p>{article.body}</p>
                  <h3>Comments:</h3>
                  {article.comments.length > 0 ? (
                    <ul>
                      {article.comments.map((comment) => (
                        <li key={comment.id}>
                          <strong>{comment.user ? comment.user.name : 'Unknown User'}</strong>: {comment.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No comments found</p>
                  )}
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

export default Home;
