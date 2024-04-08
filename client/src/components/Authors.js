import React, { useState, useEffect } from 'react';

function Authors() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch('/authors') // Fetch data from Flask endpoint
      .then(response => response.json())
      .then(data => setAuthors(data))
      .catch(error => console.error('Error fetching authors:', error));
  }, []);

  return (
    <div>
      <h2>Authors</h2>
      <table className="authors-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(author => (
            <tr key={author.username}>
              <td>{author.username}</td>
              <td>{author.fullname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Authors;