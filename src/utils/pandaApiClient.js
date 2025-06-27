import axios from 'axios';

const pandaApiClient = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default pandaApiClient;