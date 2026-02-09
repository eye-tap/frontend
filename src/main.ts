import '@fortawesome/fontawesome-free/css/all.css';
import 'vue-color/style.css';
import App from './App.vue';
import Notifications from '@kyvg/vue3-notification';
import {
    createApp
} from 'vue';
import {
    createPinia
} from 'pinia';
import router from './ts/router';
import {
    useStatusStore
} from './ts/stores/status';

const app = createApp( App );

app.use( createPinia() );
app.use( router );
app.use( Notifications );

if ( import.meta.env.VITE_BACKEND_URL ) {
    console.warn( 'Env var VITE_BACKEND_URL set: Backend at', import.meta.env.VITE_BACKEND_URL );
    localStorage.setItem( 'url', import.meta.env.VITE_BACKEND_URL );
} else if ( import.meta.env.MODE === 'production' || import.meta.env.VITE_OVERRIDE_PROD === 'true' ) {
    if ( import.meta.env.VITE_OVERRIDE_PROD === 'true' ) console.warn( 'Env var VITE_OVERRIDE_PROD set: using production backend' );

    localStorage.setItem( 'url', 'https://api.group-p23.webdev-25.ivia.isginf.ch' );
} else {
    console.warn( 'Running against local backend' );
    localStorage.setItem( 'url', 'http://localhost:8080' );
}

if ( import.meta.env.VITE_DISABLE_LOGIN_CHECK ) {
    const status = useStatusStore();

    status.setDevMode( true );
    status.setAuth( true );
    console.warn( 'Env var VITE_DISABLE_LOGIN_CHECK set: Login disabled' );
}

app.mount( '#app' );
