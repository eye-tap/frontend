import type {
    UserRoles
} from '@/types/UserData';
import {
    defineStore
} from 'pinia';

interface Status {
    'isAuth': boolean;
    'username': string;
    'roles': UserRoles[];
    'devMode': boolean;
    'devTools': boolean;
}

export const useStatusStore = defineStore( 'user', {
    'state': (): Status => ( {
        'isAuth': false,
        'username': '',
        'roles': [],
        'devMode': false,
        'devTools': false
    } ),
    'getters': {
        'getAuth': state => state.isAuth
    },
    'actions': {
        setAuth ( auth: boolean ) {
            if ( auth ) {
                setTimeout( () => {
                    document.dispatchEvent( new CustomEvent( 'eyetap:login' ) );
                }, 1000 );
            }

            this.isAuth = auth;
        },
        setUsername ( username: string ) {
            this.username = username;
        },
        setRoles ( roles: UserRoles[] ) {
            this.roles = roles;
        },
        setDevMode ( status: boolean ) {
            this.devMode = status;
        },
        setDevTools ( status: boolean ) {
            this.devTools = status;
        }
    }
} );
