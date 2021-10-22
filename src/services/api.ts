import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://give-me-feedback-node.herokuapp.com'
})