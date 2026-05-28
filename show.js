const id = new URLSearchParams(window.location.search).get("id");

const showContainer = document.getElementById("show");
const showTitle = document.getElementById("show-title");
const episodesList = document.getElementById("episodes-list");
const nextBtn = document.getElementById("next-btn");

async function getShowData(id) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  return await res.json();
}

async function getEpisodes(id) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
  return await res.json();
}

function renderShow(show) {
  showTitle.innerText = show.name;

  showContainer.innerHTML = `
    <div class="show-bg" style="background-image: url('${show.image?.original || show.image?.medium || ""}')"></div>

    <div class="show-hero">
      <div class="show-poster">
        <img src="${show.image?.original || show.image?.medium || ""}" alt="${show.name}" />
      </div>

      <div class="show-info">
        <h2>${show.name}</h2>

        <div class="show-meta">
          <span>⭐ ${show.rating?.average || "N/A"}</span>
          <span>📺 ${show.premiered || "Unknown"}</span>
          <span>🎭 ${show.genres?.join(", ") || "N/A"}</span>
        </div>

        <p>
          ${show.summary ? show.summary.replace(/<[^>]*>/g, "") : "No description available."}
        </p>

        <a class="watch-btn" href="${show.officialSite || "#"}" target="_blank">
          Watch / Official Site
        </a>
      </div>
    </div>
  `;
}

function groupBySeason(episodes) {
  return episodes.reduce((acc, ep) => {
    const season = ep.season;

    if (!acc[season]) acc[season] = [];

    acc[season].push(ep);

    return acc;
  }, {});
}

function renderEpisodes(episodes) {
  const grouped = groupBySeason(episodes);

  episodesList.innerHTML = "";

  Object.keys(grouped).forEach((season) => {
    const block = document.createElement("div");
    block.classList.add("season-block");

    block.innerHTML = `
      <h2 class="season-title">Season ${season}</h2>

      <div class="episodes-grid">
        ${grouped[season]
          .map(
            (ep) => `
              <div class="episode-card">
                <img src="${ep.image?.medium || ""}" />

                <div class="episode-content">
                  <div class="episode-info"><div class ="episode-number">Ep ${ep.number}</div><div class="episode-runtime">${ep.runtime || "N/A"} min</div></div>
                  <h3>${ep.name}</h3>
                  <p>${
                    ep.summary
                      ? ep.summary.replace(/<[^>]*>/g, "")
                      : "No description"
                  }</p>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    `;

    episodesList.appendChild(block);
  });
}

async function init() {
  const show = await getShowData(id);
  renderShow(show);

  const episodes = await getEpisodes(id);
  renderEpisodes(episodes);
}

nextBtn.addEventListener("click", () => {
  window.location.href = `show.html?id=${Number(id) + 1}`;
});

init();
