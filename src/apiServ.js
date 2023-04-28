import axios from 'axios';
export default class PicsApi {
  constructor() {
    this.topic = '';
    this.page = 1;
  }

  async fetchPics() {
    const URL = 'https://pixabay.com/api/';
    const KEY = '35857249-0d707f1bd6e70bbb52b237dd3';

    const response = await axios.get(`${URL}`, {
      params: {
        q: this.topic,
        page: this.page,
        per_page: 40,
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
}
