const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const changeMode = document.querySelector('#change-mode')

// page data
const MOVIES_PER_PAGE = 12
let currentPage = 1

// store movie data in an array
let movies = []

// store filtered movie data in an array
let filteredMovies = []

// card mode
let cardMode = true

// request the API by axios
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((error) => console.log(error))

// render movie card 
const dataPanel = document.querySelector('#data-panel')

function renderMovieList(data) {
  let rawHTML = ''
  if (cardMode) {
    data.forEach((item) => {
      // fill the image and title in card mode
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
    })
  } else {
    console.log('yo')
    rawHTML = `<ul class="list-group render-movie-list container-fluid">`
    data.forEach((item) => {
      rawHTML += `<li class="list-group-item d-flex justify-content-between">${item.title}
        <div class="list-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
      </li>`
    })
    rawHTML += `</ul>`
  }
  dataPanel.innerHTML = rawHTML
}



////// pagination //////

// pagination render function
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}



////// render movie modal  //////

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

////// favorite movies //////

// function for favorite movie
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在電影收藏清單中囉～')
  } else {
    list.push(movie)

    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
}

// add event listener to show movie modal
dataPanel.addEventListener('click', function onPanelClick(event) {
  // lock the event target to the "more" button
  if (event.target.matches('.btn-show-movie')) {
    // call function by return the id-data
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// add event listener to search movie
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 取消重新讀取頁面的預設事件
  event.preventDefault()
  // 取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  // 用 filter 篩選資料
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  console.log(filteredMovies)
  // 確認是否有符合關鍵字的資料
  if (!filteredMovies.length) {
    return alert(`您輸入的關鍵字${keyword}無法找到相關資訊`)
  } else {
    // 重新渲染畫面
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(1))
  }
})

// add event listener to change page
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  currentPage = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(currentPage))
})

// add event listener to change mode
changeMode.addEventListener('click', function onChangeModeClicked(event) {
  if (event.target.matches('.fa-bars')) {
    cardMode = false
    renderMovieList(getMoviesByPage(currentPage))
  } else if (event.target.matches('.fa-th')) {
    cardMode = true
    renderMovieList(getMoviesByPage(currentPage))
  }
})