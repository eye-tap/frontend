import {
    createRouter, createWebHistory
} from 'vue-router';
import NProgress from 'nprogress';
import type {
    UserRoles
} from '@/types/UserData';
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

    if ( store.devMode ) return;

    if ( to.meta.allowedRoles && ( to.meta.allowedRoles as string[] ).length > 0 && !store.isAuth ) {
        return {
            'name': 'login'
        };
    } else if ( to.meta.allowedRoles ) {
        if ( store.roles.length === 0
            || !store.roles.map( role => ( to.meta.allowedRoles as string[] ).includes( role ) ).reduce( ( prev, val ) => prev || val ) ) {
            const redir = store.roles[0]
                ? ( to.meta.redirectTarget as {
                    [key in UserRoles]: string
                } )[store.roles[0]!] ?? from.name
                : 'login';

            console.log( 'redirecting to', redir );


            return {
                'name': redir
            };
        }
    }

    if ( to.name === 'app-editor' ) {
        if ( !session.selected ) {
            if ( store.roles.includes( 'ROLE_SURVEY_PARTICIPANT' ) )
                return {
                    'name': 'app-survey-home'
                };
            else
                return {
                    'name': 'app-home'
                };
        }
    } else if ( ( to.name === 'login' && store.isAuth ) || ( to.name === 'signup' && store.isAuth ) ) {
        if ( store.roles.includes( 'ROLE_SURVEY_PARTICIPANT' ) )
            return {
                'name': 'app-survey-home'
            };
        else if ( store.roles.includes( 'ROLE_CROWD_SOURCE' ) )
            return {
                'name': 'app-home'
            };
        else
            return {
                'name': 'admin-home'
            };
    } else if ( to.name === 'magic' && store.isAuth ) {
        if ( store.roles.includes( 'ROLE_CROWD_SOURCE' ) )
            return {
                'name': 'app-survey-home'
            };
    } else if ( to.name === 'admin-home' ) {
        // Automatically redirect on admin panel
        return {
            'name': 'surveys-none-selected'
        };
    }
} );

router.afterEach( to => {
    window.scrollTo( {
        'top': 0,
        'behavior': 'smooth'
    } );
    document.title = to.meta.title ? to.meta.title + ' - EYE-TAP' : 'EYE-TAP';
    NProgress.done();
} );

export default router;
