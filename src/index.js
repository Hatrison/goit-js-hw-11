const axios = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import './css/styles.css';
import fetchImages from './fetchImages.js';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);

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

  try {
    const response = await fetchImages(value);
    renderGallery(response);
  } catch (error) {
    console.log(error.message);
  }

  console.log(value);
}

function renderGallery({ hits }) {
  if (!hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const markup = hits.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      `<div class="photo-card">
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
      </div>`,
    ''
  );

  gallery.insertAdjacentHTML('beforeend', markup);
}
