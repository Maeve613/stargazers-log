const repositoryList = document.querySelector("#repository-list");
const status = document.querySelector("#status");

function renderRepositories(repositories) {
  const fragment = document.createDocumentFragment();

  for (const repository of repositories) {
    const item = document.createElement("li");
    const card = document.createElement("article");
    const heading = document.createElement("h3");
    const link = document.createElement("a");
    const description = document.createElement("p");
    const date = document.createElement("time");
    const starredDate = new Date(`${repository.starredAt}T00:00:00`);

    item.className = "repository-item";
    card.className = "repository-card";
    heading.className = "repository-title";
    link.href = repository.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${repository.owner}/${repository.name}`;
    description.className = "repository-description";
    description.textContent = repository.description;
    date.className = "repository-date";
    date.dateTime = repository.starredAt;
    date.textContent = `Starred ${starredDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    })}`;

    heading.append(link);
    card.append(heading, description, date);
    item.append(card);
    fragment.append(item);
  }

  repositoryList.replaceChildren(fragment);
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (
      !Array.isArray(repositories) ||
      repositories.some((repository) =>
        !repository ||
        typeof repository.owner !== "string" ||
        typeof repository.name !== "string" ||
        typeof repository.description !== "string" ||
        typeof repository.url !== "string" ||
        typeof repository.starredAt !== "string"
      )
    ) {
      throw new Error("Repository data has an invalid format");
    }

    renderRepositories(repositories);
    status.textContent = repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Unable to load starred repositories:", error);
    status.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
