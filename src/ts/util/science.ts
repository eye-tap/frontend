import request from './request';
import {
    useAnnotationSessionStore
} from '../stores/annotationSessionStore';

export type EyeTapTrackingEvents = 'undo-redo' | 'completion'
    | 'disagreement-solution-click' | 'disagreement-solution-bind'
    | 'zoom' | 'scanpath-move' | 'export'; // if we do colorblind mode, then this

export type EyeTapTrackingEventsShort = 'ur' | 'c' | 'dc' | 'db' | 'z' | 'sp' | 'e';

export type EyeTapTrackingData = {
    [key in EyeTapTrackingEvents]: number[]
};

export type EyeTapTrackingCounts = {
    [key in EyeTapTrackingEvents]: number
};

export type EyeTapTrackingCountsShort = {
    [key in EyeTapTrackingEventsShort]: number
};

export interface EyeTapTrackingDataDetails {
    'd': EyeTapTrackingCountsShort; // data
    't': number; // Timestamp
    'e': number; // Elapsed
    'x': number; // Texts
    'f': {
        'a': number, // number of added annotations
        'u': number, // number of deleted annotations
        'd': number, // number of invalidate
        'f': number, // number of undo invalidate
    }
}

let startTime = 0;
let data: EyeTapTrackingData = {
    'undo-redo': [],
    'completion': [],
    'zoom': [],
    'disagreement-solution-click': [],
    'disagreement-solution-bind': [],
    'scanpath-move': [],
    'export': []
};
let previousEpochs: EyeTapTrackingDataDetails[] = [];

const start = async () => {
    startTime = new Date().getTime();

    try {
        const res = await request.get( '/user/analytics' );

        previousEpochs = JSON.parse( res ? res : '[]' );
    } catch { /* empty */ }

    console.log( '[SCIENCE] Loaded data, found', previousEpochs.length, 'existing epochs' );
};

/** Reset the tracking data. Automatically called by the send function */
const reset = () => {
    data = {
        'undo-redo': [],
        'completion': [],
        'zoom': [],
        'disagreement-solution-click': [],
        'disagreement-solution-bind': [],
        'scanpath-move': [],
        'export': []
    };
    startTime = new Date().getTime();
};

const clear = () => {
    reset();
    previousEpochs = [];
    save( 0, 0, 0, 0 );
};

/**
 * Store that user used feature at this time
 * @param feature - The feature that was used
 */
const track = ( feature: EyeTapTrackingEvents ) => {
    data[ feature ].push( new Date().getTime() );
};


/**
 * @returns The tracking data that was accumulated since last reset
 */
const get = () => {
    return data;
};


/**
 * @returns The number of tracking events since last reset
 */
const getCounts = (): EyeTapTrackingCounts => {
    const counts: EyeTapTrackingCounts = {
        'undo-redo': 0,
        'completion': 0,
        'zoom': 0,
        'disagreement-solution-click': 0,
        'disagreement-solution-bind': 0,
        'scanpath-move': 0,
        'export': 0
    };

    for ( const key in data ) {
        counts[ key as EyeTapTrackingEvents ] = data[ key as EyeTapTrackingEvents ]!.length;
    }

    return counts;
};

const getCountsShort = (): EyeTapTrackingCountsShort => {
    return {
        'ur': data[ 'undo-redo' ].length,
        'c': data[ 'completion' ].length,
        'z': data[ 'zoom' ].length,
        'dc': data[ 'disagreement-solution-click' ].length,
        'db': data[ 'disagreement-solution-bind' ].length,
        'sp': data[ 'scanpath-move' ].length,
        'e': data[ 'export' ].length
    };
};

const getElapsedTime = (): number => {
    return Math.round( ( new Date().getTime() - startTime ) / 100 ) / 10;
};


/** Send the tracking data to the backend */
const save = ( annAdded: number, annRemoved: number, invalidated: number, unInvalidated: number, wasShowingTour: boolean = false ) => {
    const state = useAnnotationSessionStore();

    previousEpochs.push( {
        'd': getCountsShort(),
        't': new Date().getTime(),
        'e': getElapsedTime(),
        'x': wasShowingTour
            ? -2
            : ( state.sessionIds[ state.sessionIdx ] ? ( state.sessionIds[ state.sessionIdx ]!.sessionId ?? -1 ) : -1 ),
        'f': {
            'a': annAdded,
            'u': annRemoved,
            'f': invalidated,
            'd': unInvalidated
        }
    } );
    console.log( '[SCIENCE] Saving analytics,', previousEpochs.length, 'sets available' );
    request.beaconRequest( '/user/analytics', JSON.stringify( previousEpochs ) );
    reset();
};

export default {
    get,
    getCounts,
    getElapsedTime,
    save,
    track,
    reset,
    clear,
    start
};
