// src/store.js
import { reactive } from 'vue';

export const store = reactive({
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  token: localStorage.getItem('token') || ''
});

export function setUserInfo(userInfo) {
  store.userInfo = userInfo;
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function setToken(token) {
  store.token = token;
  localStorage.setItem('userToken', token);
}

export function clearUserInfo() {
  store.userInfo = null;
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userToken');
}
