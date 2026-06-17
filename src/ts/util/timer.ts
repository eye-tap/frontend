import {
    ref
} from 'vue';
import request from './request';

export const timer = ref( '' );

export const startTimer = async ( availableTime: number, name: string = '' ) => {
    let startTime = new Date().getTime();
    let sentEvent = false;
    let stored = sessionStorage.getItem( 'start-time' );

    if ( !stored ) {
        stored = await request.getUserOptions( 'startTime' );

        if ( stored ) {
            sessionStorage.setItem( 'start-time', stored );
        } else {
            request.updateUserOptions( 'startTime', new Date().toISOString() );
            sessionStorage.setItem( 'start-time', new Date().toISOString() );
        }
    }

    startTime = new Date( stored ).getTime();

    setInterval( () => {
        const remaining = availableTime - Math.round( ( new Date().getTime() - startTime ) / 1000 );

        if ( remaining < 0 ) {
            if ( !sentEvent ) {
                sentEvent = true;
                document.dispatchEvent( new CustomEvent( 'eyetap:timer-ended', {
                    'detail': name
                } ) );
            }
        } else {
            timer.value = `${ Math.floor( remaining / 60 ) }:${ Math.round( remaining % 60 ) }`;
        }
    }, 500 );
};
