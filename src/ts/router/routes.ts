import HomeView from '@/views/StartView.vue';
import {
    adminBaseRoute
} from '@/components/admin/adminConfig';

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
        'path': '/signup/admin',
        'name': 'signup-admin',
        'component': () => import( '@/views/auth/SignupAdmin.vue' ),
        'meta': {
            'title': 'Signup as Survey Admin',
            'authRequired': false
        }
    },
    {
        'path': '/app',
        'name': 'app',
        'component': () => import( '@/views/AppMainView.vue' ),
        'children': [
            {
                'path': '',
                'name': 'app-home',
                'component': () => import( '@/views/app/AppHome.vue' ),
                'meta': {
                    'title': 'Home',
                    'authRequired': true,
                    'allowedRoles': [
                        'ROLE_SURVEY_PARTICIPANT',
                        'ROLE_SURVEY_CROWD_SOURCE'
                    ]
                }
            },
            {
                'path': 'editor',
                'name': 'app-editor',
                'component': () => import( '@/views/app/AppEditor.vue' ),
                'meta': {
                    'title': 'Editor',
                    'authRequired': true,
                    'allowedRoles': [
                        'ROLE_SURVEY_PARTICIPANT',
                        'ROLE_SURVEY_CROWD_SOURCE'
                    ],
                    'mode': 'editor'
                }
            }
        ]
    },
    {
        'path': adminBaseRoute,
        'name': 'admin',
        'component': () => import( '@/views/admin/AdminHome.vue' ),
        'meta': {
            'title': 'Admin Panel (dev)',
            'authRequired': true,
            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
        },
        'children': [
            {
                'path': '',
                'name': 'admin-home',
                'component': () => import( '@/components/admin/surveys/SurveyNoneSelected.vue' ),
                'meta': {
                    'title': 'Admin',
                    'authRequired': true,
                    'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                }
            },
            {
                'path': 'surveys',
                'name': 'admin-surveys',
                'component': () => import( '@/components/admin/SurveyManager.vue' ),
                'meta': {
                    'title': 'Admin',
                    'authRequired': true,
                    'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                },
                'children': [
                    {
                        'path': '',
                        'name': 'surveys-none-selected',
                        'component': () => import( '@/components/admin/surveys/SurveyNoneSelected.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'authRequired': true,
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    },
                    // id is the unique id associated with a survey
                    {
                        'path': ':id',
                        'name': 'surveys-selected',
                        'component': () => import( '@/components/admin/surveys/SurveyProperties.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'authRequired': true,
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    },
                    {
                        'path': 'create',
                        'name': 'create-survey',
                        'component': () => import( '@/components/admin/surveys/SurveyCreator.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'authRequired': true,
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    },
                    {
                        'path': 'magiclinks',
                        'name': 'magiclinks',
                        'component': () => import( '@/components/admin/surveys/SurveyMagicLinks.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'authRequired': true,
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    }
                ]
            },
            {
                'path': 'texts',
                'name': 'texts',
                'component': () => import( '@/components/admin/TextManager.vue' ),
                'meta': {
                    'title': 'Admin',
                    'authRequired': true,
                    'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                },
                'children': [
                    {
                        'path': '',
                        'name': 'texts-options',
                        'component': () => import( '@/components/admin/texts/TextUpload.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'authRequired': true,
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    },
                    {
                        'path': 'options',
                        'name': 'texts-create',
                        'component': () => import( '@/components/admin/texts/TextUploadOptions.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'authRequired': true,
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    }
                ]
            }
        ]
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
