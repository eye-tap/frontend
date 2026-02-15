import {
    createRouter, createWebHistory
} from 'vue-router';
import NProgress from 'nprogress';
import {
    routes
} from './routes';
import {
    useActiveFileStore
} from '@/ts/stores/activeFileStore';
import {
    useStatusStore
} from '@/ts/stores/status';

NProgress.configure( {} );

const router = createRouter( {
    'history': createWebHistory( import.meta.env.BASE_URL ),
    'routes': routes
} );


router.beforeResolve( ( to, _from, next ) => {
    if ( to.name ) {
        NProgress.start();
    }

    next();
} );

router.beforeEach( to => {
    const store = useStatusStore();
    const file = useActiveFileStore();

    if ( to.meta.authRequired && !store.isAuth ) {
        return {
            'name': 'login'
        };
    } else if ( ( to.name === 'login' && store.isAuth ) || ( to.name === 'signup' && store.isAuth ) ) {
        return {
            'name': 'app-home'
        };
    } else if ( to.name === 'app-home' && store.role === 'admin' && !store.devMode ) {
        return {
            'name': 'admin'
        };
    } else if ( to.name === 'admin' && store.role !== 'admin' && !store.devMode ) {
        return {
            'name': 'app-home'
        };
    } else if ( to.name === 'app-editor' ) {
        if ( !file.selected && !store.devMode ) {
            return {
                'name': 'app-home'
            };
        }
    }
} );

router.afterEach( to => {
    window.scrollTo( {
        'top': 0,
        'behavior': 'smooth'
    } );
    document.title = to.meta.title ? to.meta.title + ' - EyeTAP' : 'EyeTAP';
    NProgress.done();
} );

export default router;
