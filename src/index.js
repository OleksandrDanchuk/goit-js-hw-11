import PicsApi from './apiServ';
import LoadMoreBtn from './loadMoreBtn';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormRef = document.querySelector('.search-form');
const galletyRef = document.querySelector('.gallery');
const btnLoadMoreRef = document.querySelector('.load-more');
const picsApi = new PicsApi(40);
const loadMoreButton = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

searchFormRef.addEventListener('submit', onSearch);
btnLoadMoreRef.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  picsApi.topic = e.currentTarget.elements.searchQuery.value.trim();
  picsApi.resetPage();
  resetMarkup();

  if (picsApi.topic === '') {
    Notiflix.Notify.warning('Fill the search input');
    return;
  }

  loadMoreButton.show();
  loadMoreButton.disabled();

  try {
    const { totalHits, hits } = await picsApi.fetchPics();

    if (hits.length === 0) {
      loadMoreButton.hide();
      Notiflix.Notify.warning(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
      return;
    }

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    rendermarkup(hits);
    autoScroll(0.35);

    if (totalHits < picsApi.getLimit()) {
      loadMoreButton.hide();
    } else {
      loadMoreButton.enable();
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops something gone wrong..');
    console.log(error);
  }
}
async function onLoadMore() {
  picsApi.setPage(picsApi.getPage() + 1);
  loadMoreButton.disabled();
  try {
    const { totalHits, hits } = await picsApi.fetchPics();
    if (picsApi.getLimit() * picsApi.getPage() > totalHits) {
      loadMoreButton.hide();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreButton.enable();
    }
    rendermarkup(hits);
    autoScroll(2);
  } catch (error) {
    Notiflix.Notify.failure('Oops something gone wrong..');
    console.log(error);
  }
}

function makeMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
	</a>
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
</div>`;
}

function rendermarkup(data) {
  const markup = data.reduce((html, topic) => html + makeMarkup(topic), '');
  galletyRef.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function resetMarkup() {
  galletyRef.innerHTML = '';
}

function autoScroll(n) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * n,
    behavior: 'smooth',
  });
}
