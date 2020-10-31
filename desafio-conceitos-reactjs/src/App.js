import React, { useState, useEffect } from "react";
import api from "./services/api";
import "./styles.css";


function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const templateRepo = {
      title: "Desafio Mobile",
      url: "https://github.com/yulken/desafio-conceitos-reactjs",
      techs: [
        "Node.js",
        "React Native"
      ],
    }
    const response = await api.post('repositories', templateRepo);
    setRepositories([...repositories, response.data])
  }

  async function handleRemoveRepository(id) {
    const newRepositories = repositories.filter(repo => repo.id !== id);
    try {
      await api.delete(`/repositories/${id}`);
      setRepositories(newRepositories);

    }
    catch (err) {
      console.error(err);
    }


  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repo => {
          return (
            <li key={repo.id}>
              {repo.title}

              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
            </button>
            </li>
          );
        })}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
