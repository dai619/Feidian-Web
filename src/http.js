import axios from 'axios'
import store from './store/store'
import * as types from './store/types'
import router from './router'
import {BASEURL} from './config/index';

axios.defaults.timeout = 5000
// 这里应该要改 axios的配置？？？？？？？
axios.defaults.baseURL = BASEURL;

// http request 拦截器
axios.interceptors.request.use(
	config => {
		//console.log(config);
		const token = store.state.token
		token && (config.headers.token = `${store.state.token}`);
		// if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
		// 	// config.headers.Authorization = `token ${store.state.token}`;
		// 	config.headers.token = `${store.state.token}`;
		// }
		return config;
	},
	err => {
		return Promise.reject(err);
	});


// 请求过去，后端提取headers的token，然后根据这个看是否有效，然后正常的话就response返回给前端，否则就status 401  axios 拦截器进行拦截

// http response 拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					// 返回 401 清除token信息并跳转到登录页面
					store.commit(types.LOGOUT);
					router.replace({
						path: '/login',
						// query: {
						// 	redirect: router.currentRoute.fullPath
						// }
					})
			}
		}
		return Promise.reject(error.response.data) // 返回接口返回的错误信息
	});

export default axios