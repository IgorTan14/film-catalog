// Настройки
const apiKey = 'd1feafe1-1ed6-4286-a47c-b01e7e22b65e';
const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
}

// DOM
const filmsWrapper = document.querySelector('.films');
const loader = document.querySelector('.loader-wrapper');
const btnLoadMore = document.querySelector('.show-more')
btnLoadMore.onclick = fetchAndRender;

let page = 1;

async function fetchData(url, options){
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

// Получение в вывод
async function fetchAndRender() {
    loader.classList.remove('none');

    const data = await fetchData(url + `top?page=${page}`, options);

    if (data.pagesCount > 1){
        page++;
        btnLoadMore.classList.remove('none')
    }
    if (page > data.pagesCount){
        btnLoadMore.classList.add('none')
    }

    loader.classList.add('none');

    renderFilms(data.films);
}

function renderFilms(films){
    for (film of films){

        const card = document.createElement('div');
        card.classList.add('card');
        card.id = film.filmId;
        card.addEventListener('click', openFilmsDetails)

        const html = `<img src="${film.posterUrlPreview}" alt="Cover" class="card__img">
                        <h3 class="card__title">${film.nameRu}</h3>
                        <p class="card__year">${film.year}</p>
                        <p class="card__rate">Рейтинг: ${film.rating}</p>`
        card.insertAdjacentHTML('afterbegin', html)
        filmsWrapper.insertAdjacentElement("beforeend", card)
    } 
}

async function openFilmsDetails(e){ 
    const id = e.currentTarget.id;

    const data = await fetchData(url + id, options);
    console.log(data);

    renderFilmData(data)
}

function renderFilmData(film){
    if (document.querySelector('.container-right')){
        document.querySelector('.container-right').remove();
    } 

    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = `<img src="./img/cross.svg" alt="Close" width="24">`;
    containerRight.insertAdjacentElement('afterbegin', btnClose);

    btnClose.addEventListener('click', function(){
        containerRight.remove()
    })
  
    const html = `<div class="film">

            <div class="film__title">${film.nameRu}</div>

            <div class="film__img">
                <img src="${film.posterUrl}" alt="${film.nameRu}">
            </div>

            <div class="film__desc">
                <p class="film__details">Год: ${film.year}</p>
                <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
                <p class="film__details">Продолжительность: ${formatLengthFilm(film.filmLength)}</p>
                <p class="film__details">Страна: ${formatCountry(film.countries)}</p>
                <p class="film_text">${film.description}</p>
            </div>`

    containerRight.insertAdjacentHTML('beforeend', html);
}

function formatLengthFilm(value){
    let length = '';

    const hours = Math.floor(value / 60);
    const minutes = value % 60

    if (hours > 0){
        length = hours + 'ч. ';
    }
    if (minutes > 0){
        length += minutes + 'мин.';
    }

    return length;
}

function formatCountry(countriesArr){
    let countriesScting = '';

    for (country of countriesArr){
        countriesScting += country.country;

        if(countriesArr.indexOf(country) + 1 < countriesArr.length) {
            countriesScting += ', '
        }
    }
    return countriesScting;
}

fetchAndRender().catch(err => console.log(err));