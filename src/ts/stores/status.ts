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
}

export const useStatusStore = defineStore( 'user', {
    'state': (): Status => ( {
        'isAuth': false,
        'username': '',
        'roles': [],
        'devMode': false
    } ),
    'getters': {
        'getAuth': state => state.isAuth
    },
    'actions': {
        setAuth ( auth: boolean ) {
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
        }
    }
} );
