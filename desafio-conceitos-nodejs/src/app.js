const express = require("express");
const cors = require("cors");
const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const repos = repositories.map(repo => repo);
  return response.status(200).json(repos);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  repo = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };


  repositories.push(repo);
  return response.status(201).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({
      error: 'Project not found.'
    });
  }
  const likes = repositories[repoIndex].likes
  const repo = {
    id,
    title,
    url,
    techs,
    likes
  };
  repositories[repoIndex] = repo;
  return response.status(200).json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({
      error: 'Project not found.'
    });
  }


  repositories.splice(repoIndex)
  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({
      error: 'Project not found.'
    });
  }
  const { title, url, techs } = repositories[repoIndex];
  const likes = repositories[repoIndex].likes + 1;
  const repo = {
    id,
    title,
    url,
    techs,
    likes
  };
  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

module.exports = app;
