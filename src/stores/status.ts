import {
    defineStore
} from 'pinia';

interface Status {
    'isAuth': boolean;
    'username': string;
    'role': 'user' | 'admin';
    'devMode': boolean;
}

export const useStatusStore = defineStore( 'user', {
    'state': (): Status => ( {
        'isAuth': false,
        'username': '',
        'role': 'user',
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
        setRole ( role: 'user' | 'admin' ) {
            this.role = role;
        },
        setDevMode ( status: boolean ) {
            this.devMode = status;
        }
    }
} );
