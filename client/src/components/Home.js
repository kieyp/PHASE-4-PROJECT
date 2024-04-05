import { useEffect, useState } from "react";

function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/articles")
      .then((response) => response.json())
      .then(setArticles);
  }, []);

  function chunkArray(array, chunkSize) {
    return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, index) =>
      array.slice(index * chunkSize, (index + 1) * chunkSize)
    );
  }

  const chunkedArticles = chunkArray(articles, 4);

  return (
    <section>
      <h2>Blog Post Home</h2>
      {chunkedArticles.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((article) => (
            <div key={article.id} className="col">
              <h3>{article.title}</h3>
              <p>{truncateText(article.body)}</p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substr(0, maxLength) + "...";
}

export default Home;
