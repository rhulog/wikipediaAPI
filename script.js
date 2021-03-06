//Selectors
const form = document.querySelector('.js-search-form');
form.addEventListener('submit', handleSubmit);

//Event handlers
async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    console.log(json);
    return json;
}

async function handleSubmit(event) {
    event.preventDefault();

    const inputValue = document.querySelector('.js-search-input').value;
    const searchQuery = inputValue.trim();

    const searchResults = document.querySelector('.js-search-results');
    searchResults.innerHTML = '';

    const spinner = document.querySelector('.js-spinner');
    spinner.classList.remove('hidden');

    try{
        const results = await searchWikipedia(searchQuery);
        if(results.query.searchinfo.totalhits == 0) {
            alert('No results found. Try different keyword');
            return;
        }

        displayResults(results);
    }catch(err){
        console.log(err);
        alert('failed to search Wikipedia');
    }finally {
      spinner.classList.add('hidden');
    }
}

//Helpers
function displayResults(results) {
    // Get a reference to the `.js-search-results` element
    const searchResults = document.querySelector('.js-search-results');
  
    // Iterate over the `search` array. Each nested object in the array can be accessed through the `result` parameter
    results.query.search.forEach(result => {
      const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
  
      // Append the search result to the DOM
      searchResults.insertAdjacentHTML(
        'beforeend',
        `<div class="result-item">
          <h3 class="result-title">
            <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
          </h3>
          <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
          <span class="result-snippet">${result.snippet}</span><br>
        </div>`
      );
    });
  }
  