import {
    availableTime
} from '@/editor/config-presets';
import {
    ref
} from 'vue';
import request from './request';

export const timer = ref( '' );

let timerInterval = 0;

export const start = async () => {
    if ( availableTime.value < 0 ) return;

    let startTime = new Date().getTime();
    let sentEvent = false;
    let stored = await request.getUserOptions( 'startTime' );

    if ( !stored ) {
        request.updateUserOptions( 'startTime', new Date().toISOString() );
        stored = new Date().toISOString();
    }

    startTime = new Date( stored ).getTime();

    timerInterval = setInterval( () => {
        const remaining = availableTime.value - Math.round( ( new Date().getTime() - startTime ) / 1000 );

        if ( remaining < 0 ) {
            if ( !sentEvent ) {
                sentEvent = true;
                document.dispatchEvent( new CustomEvent( 'eyetap:timer-ended' ) );
            }
        } else {
            const sec = Math.round( remaining % 60 );

            timer.value = `${ Math.floor( remaining / 60 ) }:${ sec }${ sec < 10 ? '0' : '' }`;
        }
    }, 500 );

    document.addEventListener( 'eyetap:logout', stop );
};

const stop = () => {
    clearInterval( timerInterval );
    timer.value = '';
};
