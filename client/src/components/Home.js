import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [heros, setHeros] = useState([]);

  useEffect(() => {
    fetch("/heroes")
      .then((r) => r.json())
      .then(setHeros);
  }, []);

  return (
    <section>
      <h2>Blog Post Home</h2>
      <ul>
        {heros.map((hero) => (
          <li key={hero.id}>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Home;
