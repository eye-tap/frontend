import {
    createRouter, createWebHistory
} from 'vue-router';
import NProgress from 'nprogress';
import {
    routes
} from './routes';
import {
    useAnnotationSessionStore
} from '../stores/annotationSessionStore';
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

router.beforeEach( ( to, from ) => {
    const store = useStatusStore();
    const session = useAnnotationSessionStore();

    if ( to.meta.authRequired && !store.isAuth ) {
        return {
            'name': 'login'
        };
    } else if ( ( to.name === 'login' && store.isAuth ) || ( to.name === 'signup' && store.isAuth ) ) {
        return {
            'name': 'app-home'
        };
    } else if ( to.name === 'admin-home' ) {
        // Automatically redirect on admin panel
        return {
            'name': 'surveys-none-selected'
        };
    } else if ( to.meta.allowedRoles && !store.devMode ) {
        if ( store.roles.length === 0
            || !store.roles.map( role => ( to.meta.allowedRoles as string[] ).includes( role ) ).reduce( ( prev, val ) => prev || val ) ) {
            return {
                'name': from.name
            };
        }
    } else if ( to.name === 'app-editor' ) {
        if ( !session.selected && !store.devMode ) {
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
