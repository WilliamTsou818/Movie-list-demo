const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// store movie data in an array
let movies = JSON.parse(localStorage.getItem('favoriteMovies'))
console.log(movies)


// render movie list 
const dataPanel = document.querySelector('#data-panel')
renderMovieList(movies)

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // fill the image and title 
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// render movie modal

// function for rendering movie modal by id
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDescription = document.querySelector('#movie-modal-description')
  const modalDate = document.querySelector('#movie-modal-date')
  // request movie data and render HTML text
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release Data: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

// function to remove movies from favorite movie list
function removeFavoriteMovie(id) {
  let index = movies.findIndex(movie => movie.id === id)
  if (index !== -1) {
    movies.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    renderMovieList(movies)
  } else {
    return
  }
}

// add event listener to show movie modal
dataPanel.addEventListener('click', function onPanelClick(event) {
  // lock the event target to the "more" button
  if (event.target.matches('.btn-show-movie')) {
    // call function by return the id-data
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavoriteMovie(Number(event.target.dataset.id))
  }
})