import React from 'react';

function Authors() {
  const authors = [
    { id: 1, name: 'Abdi Mohamed', email: 'abdi.moha@gmail.com', blogsWritten: 10 },
    { id: 2, name: 'Philip Muthami', email: 'Philip.thami@yahoo.com', blogsWritten: 15 },
    { id: 3, name: 'Alex Johnson', email: 'alex@example.com', blogsWritten: 8 },
  ];

  return (
    <div>
      <h2>Authors</h2>
      <table className="authors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Blogs Written</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(author => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.email}</td>
              <td>{author.blogsWritten}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Authors;
