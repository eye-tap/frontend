import {
    ref
} from 'vue';
import router from '../router';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    useStatusStore
} from '@/ts/stores/status';
import type {
    JWT
} from '@/types/jwt';

const loggingIn = ref( false );
const errMsg = ref( '' );
const notifications = useNotification();

const login = async ( id: string, password: string ): Promise<void> => {
    loggingIn.value = true;
    errMsg.value = '';
    const status = useStatusStore();

    try {
        const res = await fetch( localStorage.getItem( 'url' ) + '/auth/login', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify( {
                'id': id,
                'password': password
            } ),
            'credentials': 'include'
        } );

        if ( res.status === 200 ) {
            const data = await res.json();

            localStorage.setItem( 'jwt', data.token );

            const jwtData: JWT | null = decodeJwt( data.token );

            status.setAuth( true );
            loggingIn.value = false;

            if ( !jwtData || !jwtData?.username ) {
                console.error( 'Something is wrong with the JWT, this data should be encoded!' );
            }

            if ( jwtData && jwtData.username ) {
                status.setUsername( jwtData?.username );
            }

            if ( jwtData && jwtData.roles! ) {
                status.setRoles( jwtData.roles! );
            }

            notifications.notify( {
                'text': 'Welcome back to Eye-TAP',
                'type': 'success',
                'title': 'Login'
            } );
            await router.push( '/app' )
                .catch( e => console.error( 'Router push failed:', e ) );
        } else if ( res.status === 400 || res.status === 401 || res.status === 403 ) {
            errMsg.value = 'Email / Username or password incorrect.';
            loggingIn.value = false;
        } else {
            errMsg.value = 'Unknown error occurred';
            loggingIn.value = false;
        }
    } catch ( e ) {
        console.error( e );
        errMsg.value = 'Network error';
        loggingIn.value = false;
    }
};

const decodeJwt = ( token: string ): object | null => {
    console.log( 'DECODING JWT ', token );

    const payload = token.split( '.' )[1];

    if ( !payload ) {
        return null;
    }

    const decoded = atob( payload.replace( /-/g, '+' ).replace( /_/g, '/' ) );

    return JSON.parse( decoded );
};

const verify = async (): Promise<void> => {
    const status = useStatusStore();

    try {
        const token = localStorage.getItem( 'jwt' );

        if ( !token ) {
            status.setAuth( false );
            status.setUsername( '' );

            return Promise.reject( 'No token present' );
        }

        // 1. Decode JWT locally
        const jwtData: JWT | null = decodeJwt( token );

        if ( !jwtData ) {
            status.setAuth( false );
            status.setUsername( '' );

            localStorage.removeItem( 'jwt' );

            return Promise.reject( 'Unable to decode token' );
        } else {
            if ( jwtData.roles! ) {
                status.setRoles( jwtData.roles! );
            }

            status.setAuth( true );
            status.setUsername( jwtData.username! );
            Promise.resolve();
        }
    } catch ( e ) {
        console.error( 'verify failed:', e );
        status.setAuth( false );
        status.setUsername( '' );
        localStorage.removeItem( 'jwt' );
        Promise.reject( e );
    }
};

const logout = (): void => {
    const status = useStatusStore();

    // Clear local authentication state
    status.setAuth( false );
    status.setUsername( '' );

    // Remove stored JWT
    localStorage.removeItem( 'jwt' );

    notifications.notify( {
        'text': 'Logged out successfully. Good bye!',
        'type': 'success',
        'title': 'Logout'
    } );

    // Redirect to home
    router.push( '/' );
};


const signup = ( username: string, email: string, pw: string ): Promise<boolean> => {
    return new Promise( ( resolve, reject ) => {
        fetch( localStorage.getItem( 'url' ) + '/auth/register', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify( {
                'id': username,
                'email': email,
                'password': pw,
                'accountType': 'SURVEY_ADMIN' // TODO: Update this
            } ),
            'credentials': 'include'
        } )
            .then( async res => {
                if ( res.status === 201 || res.status === 200 ) {
                    // User created successfully
                    resolve( true );
                } else if ( res.status === 400 ) {
                    // User already exists
                    const data = await res.json().catch( () => ( {
                        'message': 'User already exists'
                    } ) );

                    console.warn( data.message );
                    resolve( false );
                } else {
                    const data = await res.json().catch( () => ( {
                        'message': 'Unknown error'
                    } ) );

                    console.error( 'Signup error:', data.message );
                    resolve( false );
                }
            } )
            .catch( e => {
                console.error( 'Network error:', e );
                reject( e );
            } );
    } );
};


export default {
    login,
    verify,
    logout,
    signup,
    loggingIn,
    errMsg
};
