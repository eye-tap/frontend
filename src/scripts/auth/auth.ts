/*
 *                      oauth - auth.ts
 *
 *    Created by Janis Hutz 08/26/2025, Licensed under the GPL V3 License
 *           https://janishutz.com, development@janishutz.com
 *
 *
*/

import {
    onMounted,
    ref
} from 'vue';
import request from '@/scripts/request.ts';
import router from '@/router';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    useStatusStore
} from '@/stores/status';

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
                password
            } ),
            'credentials': 'include'
        } );

        if ( res.status === 200 ) {
            const data = await res.json();

            localStorage.setItem( 'jwt', data.token );

            const jwtData: {
                'id'?: number;
                'email'?: string;
                'username'?: string;
                'exp'?: number;
            } | null = decodeJwt( data.token );

            status.setAuth( true );
            loggingIn.value = false;

            if ( !jwtData || !jwtData?.username ) {
                console.error( 'Something is wrong with the JWT, this data should be encoded!' );
            }

            if ( jwtData && jwtData.username ) {
                status.setUsername( jwtData?.username );
            }

            notifications.notify( {
                'text': 'Welcome back to Eye-TAP',
                'type': 'success',
                'title': 'Login'
            } );
            await router.push( '/app' )
                .catch( e => console.error( 'Router push failed:', e ) );
        } else if ( res.status === 400 || res.status === 401 ) {
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
    const payload = token.split( '.' )[1];

    if ( !payload ) {
        return null;
    }

    const decoded = atob( payload.replace( /-/g, '+' ).replace( /_/g, '/' ) );

    return JSON.parse( decoded );
};

const verify = ( noRedirect = false ): Promise<void> => {
    const status = useStatusStore();

    return new Promise( ( resolve, reject ) => {
        try {
            const token = localStorage.getItem( 'jwt' );

            if ( !token ) {
                status.setAuth( false );
                status.setUsername( '' );

                return reject( 'No token present' );
            }

            // 1. Decode JWT locally
            const jwtData: {
                'id'?: number;
                'email'?: string;
                'username'?: string;
                'exp'?: number;
            } | null = decodeJwt( token );

            if ( !jwtData ) {
                status.setAuth( false );
                status.setUsername( '' );

                localStorage.removeItem( 'jwt' );

                return reject( 'Unable to decode token' );
            }

            // 3. Ask backend ONLY if token is valid
            return request.get( '/auth/verify', noRedirect )
                .then( () => {
                    status.setAuth( true );
                    status.setUsername( jwtData.username! );

                    return resolve();
                } )
                .catch( e => {
                    status.setAuth( false );
                    status.setUsername( '' );
                    localStorage.removeItem( 'jwt' );
                    reject( e );
                } );
        } catch ( e ) {
            console.error( 'verify failed:', e );
            status.setAuth( false );
            status.setUsername( '' );
            localStorage.removeItem( 'jwt' );
            reject( e );
        }
    } );
};

/** Redirects the user to the app page if logged in */
const verifyAndRedirect = ( noLoginRedirect = false ) => {
    onMounted( () => {
        const status = useStatusStore();

        if ( !status.isAuth ) {
            verify( noLoginRedirect )
                .then( () => {
                    if ( status.isAuth ) {
                        const redir = '/app';

                        router.push( redir );

                        return;
                    }
                } )
                .catch( () => {} );
        } else {
            router.push( '/app' );
        }
    } );
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
                username,
                email,
                'password': pw
            } ),
            'credentials': 'include'
        } )
            .then( async res => {
                if ( res.status === 201 ) {
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
    verifyAndRedirect,
    loggingIn,
    errMsg
};
