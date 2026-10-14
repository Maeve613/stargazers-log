const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

async function renderRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    for (const repository of repositories) {
      const item = document.createElement("li");
      item.className = "repository-card";

      const link = document.createElement("a");
      link.href = repository.url;
      link.textContent = repository.name;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const description = document.createElement("p");
      description.textContent = repository.description;

      const date = document.createElement("time");
      date.dateTime = repository.starredAt;
      date.textContent = `Starred ${repository.starredAt}`;

      item.append(link, description, date);
      repositoryList.append(item);
    }

    listStatus.textContent = repositories.length
      ? `${repositories.length} repositories`
      : "No starred repositories yet.";
  } catch (error) {
    listStatus.textContent = "Unable to load starred repositories.";
    console.error(error);
  }
}

renderRepositories();
