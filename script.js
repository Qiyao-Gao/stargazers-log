const statusMessage = document.querySelector("#status");
const repositoryList = document.querySelector("#repository-list");

function createRepositoryItem(event) {
  const { repository, starred_at: starredAt } = event;
  const item = document.createElement("li");
  item.className = "repository";

  const topLine = document.createElement("div");
  topLine.className = "repository-topline";

  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = repository.name;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const date = document.createElement("time");
  date.dateTime = starredAt;
  date.textContent = new Date(`${starredAt}T00:00:00`).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" }
  );

  topLine.append(link, date);
  item.append(topLine);

  if (repository.description) {
    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;
    item.append(description);
  }

  if (repository.language) {
    const language = document.createElement("p");
    language.className = "repository-meta";
    language.textContent = repository.language;
    item.append(language);
  }

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Unable to load starred repositories (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data.events)) {
      throw new Error("The starred repository data has an invalid format.");
    }

    const starredEvents = data.events.filter(
      (event) => event.type === "starred" && event.repository && event.starred_at
    );
    repositoryList.replaceChildren(...starredEvents.map(createRepositoryItem));
    statusMessage.textContent = starredEvents.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    statusMessage.textContent = "Starred repositories could not be loaded. Please try again later.";
  }
}

loadRepositories();
