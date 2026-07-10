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
            'title': 'Home'
        }
    },
    {
        'path': '/stats',
        'name': 'stats',
        'component': () => import( '@/views/StatsPage.vue' ),
        'meta': {
            'title': 'Statistics'
        }
    },
    {
        'path': '/login',
        'name': 'magic',
        'component': () => import( '@/views/auth/MagicLinkView.vue' ),
        'meta': {
            'title': 'Magic Link Login'
        }
    },
    {
        'path': '/auth/login',
        'name': 'login',
        'component': () => import( '@/views/auth/LoginView.vue' ),
        'meta': {
            'title': 'Login'
        }
    },
    {
        'path': '/signup',
        'name': 'signup',
        'component': () => import( '@/views/auth/SignupView.vue' ),
        'meta': {
            'title': 'Signup'
        }
    },
    {
        'path': '/signup/admin',
        'name': 'signup-admin',
        'component': () => import( '@/views/auth/SignupAdmin.vue' ),
        'meta': {
            'title': 'Signup as Survey Admin'
        }
    },
    {
        'path': '/app',
        'name': 'app',
        'component': () => import( '@/views/AppMainView.vue' ),
        'children': [
            {
                'path': 'colab/study',
                'name': 'app-colab-study-picker',
                'component': () => import( '@/views/app/colab/StudyPicker.vue' ),
                'meta': {
                    'title': 'Public Studies',
                    'allowedRoles': [ 'ROLE_SURVEY_CROWD_SOURCE' ],
                    'redirectTarget': {
                        'ROLE_SURVEY_PARTICIPANT': 'app-survey-picker'
                    }
                }
            },
            {
                'path': 'colab/session',
                'name': 'app-colab-session-picker',
                'component': () => import( '@/views/app/colab/AnnotationSessionPicker.vue' ),
                'meta': {
                    'title': 'Annotation Sessions',
                    'allowedRoles': [ 'ROLE_SURVEY_CROWD_SOURCE' ],
                    'redirectTarget': {
                        'ROLE_SURVEY_PARTICIPANT': 'app-survey-picker'
                    }
                }
            },
            {
                'path': 'survey',
                'name': 'app-survey-picker',
                'component': () => import( '@/views/app/survey/AnnotationSessionPicker.vue' ),
                'meta': {
                    'title': 'Home',
                    'allowedRoles': [ 'ROLE_SURVEY_PARTICIPANT' ],
                    'redirectTarget': {
                        'ROLE_SURVEY_CROWD_SOURCE': 'app-colab-study-picker'
                    }
                }
            },
            {
                'path': 'editor',
                'name': 'app-editor',
                'component': () => import( '@/views/app/AppEditor.vue' ),
                'meta': {
                    'title': 'Editor',
                    'allowedRoles': [
                        'ROLE_SURVEY_PARTICIPANT',
                        'ROLE_SURVEY_CROWD_SOURCE'
                    ],
                    'mode': 'editor',
                    'redirectTarget': {
                        'ROLE_SURVEY_PARTICIPANT': 'app-survey-home',
                        'ROLE_SURVEY_CROWD_SOURCE': 'app-home'
                    }
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
            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
        },
        'children': [
            {
                'path': '',
                'name': 'admin-home',
                'component': () => import( '@/components/admin/surveys/SurveyNoneSelected.vue' ),
                'meta': {
                    'title': 'Admin',
                    'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                }
            },
            {
                'path': 'surveys',
                'name': 'admin-surveys',
                'component': () => import( '@/components/admin/SurveyManager.vue' ),
                'meta': {
                    'title': 'Admin',
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
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    },
                    {
                        'path': 'create',
                        'name': 'create-survey',
                        'component': () => import( '@/components/admin/surveys/SurveyCreator.vue' ),
                        'meta': {
                            'title': 'Admin',
                            'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                        }
                    },
                    {
                        'path': 'magiclinks',
                        'name': 'magiclinks',
                        'component': () => import( '@/components/admin/surveys/SurveyMagicLinks.vue' ),
                        'meta': {
                            'title': 'Admin',
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
                }
            },
            {
                'path': 'texts-upload',
                'name': 'texts-upload',
                'component': () => import( '@/components/admin/TextUploadManager.vue' ),
                'meta': {
                    'title': 'Admin',
                    'authRequired': true,
                    'allowedRoles': [ 'ROLE_SURVEY_ADMIN' ]
                }
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
