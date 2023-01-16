const axios = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import './css/styles.css';
import fetchImages from './fetchImages.js';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
localStorage.setItem('input-value', '');
const perPage = 40;
let page = 1;
let pages = 1;

form.addEventListener('submit', onSubmit);

gallery.addEventListener('click', onClick);

loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const value = searchQuery.value.trim();

  if (!value) {
    Notify.warning('Please, insert your search request!');
    return;
  }

  if (value === localStorage.getItem('input-value')) {
    Notify.warning('Please, insert another search request!');
    return;
  }

  localStorage.setItem('input-value', `${value}`);
  page = 1;

  try {
    const response = await fetchImages(value, perPage, page);

    const { hits: images, totalHits } = response;
    if (!images.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    pages = Math.ceil(totalHits / perPage);

    gallery.innerHTML = '';
    renderGallery(images);
    loadMoreBtn.classList.remove('hidden');
    smoothScroll();
  } catch (error) {
    console.log(error.message);
  }
}

function onClick(event) {
  if ([...event.target.classList].includes('gallery')) return;

  event.preventDefault();
  const instance = new SimpleLightbox('.gallery a');

  instance.on('closed.simplelightbox', function () {
    instance.refresh();
  });
}

async function onLoadMore(event) {
  const value = localStorage.getItem('input-value');

  if (page < pages) page++;
  console.log(page, pages);

  try {
    const response = await fetchImages(value, perPage, page);
    const { hits: images } = response;
    renderGallery(images);
    smoothScroll();
  } catch (error) {
    console.log(error.message);
  }

  if (page === pages) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.add('hidden');
  }
}

function renderGallery(images) {
  const markup = images.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      `<a class="photo-card-link" href="${largeImageURL}">
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>
      </a>`,
    ''
  );

  gallery.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
