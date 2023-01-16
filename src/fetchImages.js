export default async function fetchImages(req, perPage, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const params = new URLSearchParams({
    key: '32874025-27c2a6f3bebdb103c7b8a921c',
    q: req,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  });
  console.log(`${BASE_URL}?${params}`);

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error();
  return response.json();
}
