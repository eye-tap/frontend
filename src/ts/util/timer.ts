import {
    ref
} from 'vue';

export const timer = ref( '' );

export const startTimer = ( availableTime: number, name: string = '' ) => {
    let startTime = new Date().getTime();
    let sentEvent = false;

    const stored = localStorage.getItem( 'start-time' );

    if ( stored ) {
        startTime = new Date( stored ).getTime();
    } else {
        localStorage.setItem( 'start-time', new Date().toISOString() );
    }

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
