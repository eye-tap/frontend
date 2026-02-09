import HomeView from '../views/HomeView.vue';

export const routes = [
    {
        'path': '/',
        'name': 'home',
        'component': HomeView,
        'meta': {
            'title': 'Home',
            'authRequired': false
        }
    },
    {
        'path': '/login',
        'name': 'login',
        'component': () => import( '@/views/auth/LoginView.vue' ),
        'meta': {
            'title': 'Login',
            'authRequired': false
        }
    },
    {
        'path': '/signup',
        'name': 'signup',
        'component': () => import( '@/views/auth/SignupView.vue' ),
        'meta': {
            'title': 'Signup',
            'authRequired': false
        }
    },
    {
        'path': '/app',
        'name': 'app',
        'component': () => import( '@/views/AppView.vue' ),
        'children': [
            {
                'path': '',
                'name': 'app-home',
                'component': () => import( '@/views/app/AppHome.vue' ),
                'meta': {
                    'title': 'Home',
                    'authRequired': true
                }
            },
            {
                'path': 'editor',
                'name': 'app-editor',
                'component': () => import( '@/views/app/AppEditor.vue' ),
                'meta': {
                    'title': 'Editor',
                    'authRequired': true
                }
            }
        ]
    },
    {
        'path': '/admin',
        'name': 'admin',
        'component': () => import( '@/views/admin/AdminHome.vue' ),
        'meta': {
            'title': 'Admin Panel',
            'authRequired': true,
            'requiredRole': 'admin'
        }
    },
    {
        'path': '/:pathMatch(.*)*',
        'name': 'NotFound',
        'component': () => import( '@/views/404View.vue' ),
        'meta': {
            'title': '404 :: Page not found',
            'transition': 'scale'
        }
    }
];
