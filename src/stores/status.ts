import {
    defineStore
} from 'pinia';

interface Status {
    'isAuth': boolean;
    'username': string;
    'devMode': boolean;
}

export const useStatusStore = defineStore( 'user', {
    'state': (): Status => ( {
        'isAuth': false,
        'username': '',
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
        setDevMode ( status: boolean ) {
            this.devMode = status;
        }
    }
} );
