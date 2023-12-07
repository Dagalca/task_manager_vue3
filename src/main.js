// Importing necessary modules and components
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { createVuetify } from 'vuetify';
import 'vuetify/dist/vuetify.min.css'; // Import Vuetify CSS
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Creating an Axios instance for API calls
const http = axios.create({
    baseURL: 'http://to-do-list.ddev.site/jsonapi/node/Task/',
    headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
    }
});

// Creating a Vue application instance
const app = createApp(App);

// Creating a Vuetify instance
const vuetify = createVuetify();

// Integrating Vuetify with the Vue app
app.use(vuetify);

// Using router for navigation
app.use(router);

// Registering the VueDatePicker component globally
app.component('VueDatePicker', VueDatePicker);

// Setting Axios instance as a global property for HTTP requests
app.config.globalProperties.$http = http;

// Mounting the Vue app to the DOM
app.mount('#app');
