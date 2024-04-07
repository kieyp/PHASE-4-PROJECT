import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch latest articles from the backend
    fetch('/articles?per_page=2')
      .then(response => response.json())
      .then(data => setArticles(data.articles))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.heading}>Welcome to Tech 2Day</h1>
      </header>
      <p style={styles.subheading}>Discover the latest trends in AI and technology.</p>
      {/* About AI and Technology */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>About AI and Technology</h2>
        <p style={styles.sectionText}>
          Technology and artificial intelligence (AI) have become inseparable components shaping our modern world. From smartphones that anticipate our needs to algorithms powering personalized recommendations, AI permeates various facets of our daily lives. Its applications extend beyond convenience, influencing industries like healthcare, finance, and transportation, revolutionizing processes and decision-making. The synergy between technology and AI continues to fuel innovation, enabling breakthroughs in areas such as autonomous vehicles, natural language processing, and advanced robotics. However, with these advancements come ethical considerations, including privacy concerns and the potential for job displacement. As we navigate this evolving landscape, harnessing the power of technology and AI responsibly holds the key to unlocking their transformative potential while ensuring a future that benefits all.
        </p>
      </section>

      {/* Latest Articles */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Latest Articles</h2>
        {articles.map(article => (
          <div key={article.id} style={styles.article}>
            <h3 style={styles.articleTitle}>{article.title}</h3>
            <p style={styles.articleBody}>{article.body.substring(0, 100)}...</p>
          </div>
        ))}
      </section>

      {/* Sign In */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Sign In</h2>
        <p style={styles.sectionText}>Please sign in to read more articles:</p>
        <div style={styles.buttonContainer}>
          <Link to="/signin" style={styles.button}>
            Sign In
          </Link>
          <Link to="/register" style={styles.button}>
            Register
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0',
    color: '#333',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subheading: {
    fontSize: '18px',
    color: '#555',
    margin: '10px 0',
  },
  section: {
    marginBottom: '40px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionHeading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  sectionText: {
    fontSize: '16px',
    marginBottom: '20px',
    lineHeight: '1.6',
    color: '#555',
  },
  article: {
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  articleTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  articleBody: {
    fontSize: '16px',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontSize: '18px',
    margin: '0 10px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
};

export default Home;