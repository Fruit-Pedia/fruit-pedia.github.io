import { html, nothing } from "../lib.js";
import { searchEngine } from "../data/search.js";
import { submitHandler } from "../until.js";

const cardResult = (content) => html` <div class="fruit">
  <img src="${content.imageUrl}" alt="example1" />
  <h3 class="title">${content.name}</h3>
  <p class="description">${content.description}</p>
  <a class="details-btn" href="/catalog/${content.objectId}">More Info</a>
</div>`;

const resultTemplate = (hasResult, data) => html` <div class="search-result">
  ${hasResult
    ? html`${data.map((el) => cardResult(el, data.user))}`
    : html`<p class="no-result">No result.</p>`}
</div>`;

const searchTemplate = (hasInput, onSubmit, hasResult, data) => html` <section
  id="search">
  <div class="form">
    <h2>Search</h2>
    <form @submit=${onSubmit} class="search-form">
      <input type="text" name="search" id="search-input" />
      <button class="button-list">Search</button>
    </form>
  </div>
  <h4>Results:</h4>
  ${hasInput ? resultTemplate(hasResult, data) : nothing};
</section>`;

export function searchView(ctx) {
  let hasInput = false;
  ctx.renderSection(searchTemplate(hasInput, submitHandler(onSubmit)));

  async function onSubmit(data) {
    hasInput = true;
    let hasResult = false;
    const results = await searchEngine(data.search)

    const resultFromSearch = results.results;

    if (resultFromSearch.length !== 0) {
      hasResult = true;
    }
    const user = ctx.user;
    if (user) {
      resultFromSearch.user = true;
    } else {
      resultFromSearch.user = false;
    }

    ctx.renderSection(
      searchTemplate(hasInput, submitHandler(onSubmit), hasResult, resultFromSearch)
    );
  }
}


