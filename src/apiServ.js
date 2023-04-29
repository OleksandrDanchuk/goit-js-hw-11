import axios from 'axios';
export default class PicsApi {
  constructor(limit) {
    this.topic = '';
    this.page = 1;
    this.limit = limit;
  }

  async fetchPics() {
    const URL = 'https://pixabay.com/api/';
    const KEY = '35857249-0d707f1bd6e70bbb52b237dd3';

    const response = await axios.get(`${URL}`, {
      params: {
        q: this.topic,
        page: this.page,
        per_page: this.limit,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        key: KEY,
      },
    });
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  setPage(page) {
    this.page = page;
  }

  getPage() {
    return this.page;
  }

  getLimit() {
    return this.limit;
  }

  setlimit(limit) {
    this.limit = limit;
  }
}
