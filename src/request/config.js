import Vue from 'vue'
import axios from 'axios'

const urlStr = '/'
const Http = axios.create({

  baseURL: urlStr,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
});

Http.interceptors.request.use(function (config) {
  // 设置全局token
  const AUTH_TOKEN = sessionStorage.getItem('token')
  config.headers.common['Authorization'] = AUTH_TOKEN
  return config;
}, function (error) {

  return Promise.reject(error);
})

// Add a response interceptor
Http.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
})

Vue.prototype.axios = Http

export default Http;
