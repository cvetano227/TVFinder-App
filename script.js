const showsContainer = document.getElementById("shows-container");
const searchInput = document.querySelector(".hero-actions input");
const searchButton = document.querySelector(".hero-actions button");

let allShows = [];

async function getShows() {
  const response = await fetch("https://api.tvmaze.com/shows");
  const shows = await response.json();

  allShows = shows;
  renderShows(allShows);
  console.log(allShows);
}

function renderShows(shows) {
  showsContainer.innerHTML = "";

  if (shows.length === 0) {
    showsContainer.innerHTML = `<p style="color:white; padding:20px;">No results found</p>`;
    return;
  }

  shows.forEach((show) => {
    let rating = "";

    const stars = Math.round((show.rating?.average || 0) / 2);

    for (let i = 0; i < stars; i++) {
      rating += `<i class="fa fa-star"></i>`;
    }

    showsContainer.innerHTML += `
      <div class="show">
        <img src="${show.image?.medium || ""}" alt="${show.name}" />

        <div class="show-inner">
          <div class="show-content">
            <div class="rating">${rating}</div>
            <h2>${show.name}</h2>
          </div>

          <div class="show-footer">
            ${
              show.officialSite
                ? `<a href="${show.officialSite}" target="_blank">Official Site</a>`
                : ""
            }
            <a href="show.html?id=${show.id}">Learn More</a>
          </div>
        </div>
      </div>
    `;
  });
}

function filterShows() {
  const value = searchInput.value.toLowerCase();

  const filtered = allShows.filter((show) =>
    show.name.toLowerCase().includes(value),
  );

  renderShows(filtered);
}

searchInput.addEventListener("input", filterShows);
searchButton.addEventListener("click", filterShows);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    filterShows();
  }
});

getShows();
