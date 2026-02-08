import {
    ref
} from 'vue';

const tourConfig = ref( {
    'shown': false,
    'x': 0,
    'y': 0,
    'title': '',
    'desc': ''
} );
const tourDisplays: string[] = [];

const registerTourDisplay = ( name: string ) => {
    if ( tourDisplays.length > 1 ) console.warn( '[TOUR] WARNING: multiple tour displays registered' );

    tourDisplays.push( name );
};

const unregisterTourDisplay = ( name: string ) => {
    const idx = tourDisplays.indexOf( name );

    if ( idx > -1 ) tourDisplays.splice( idx, 1 );
};

export {
    tourConfig,
    registerTourDisplay,
    unregisterTourDisplay
};
