import request from './request';

export type EyeTapTrackingEvents = 'undo-redo' | 'completion'
    | 'disagreement-solution-click' | 'disagreement-solution-bind'
    | 'zoom' | 'scanpath-move' | 'export'; // if we do colorblind mode, then this

export type EyeTapTrackingData = {
    [key in EyeTapTrackingEvents]: number[]
};

export type EyeTapTrackingCounts = {
    [key in EyeTapTrackingEvents]: number
};

export interface EyeTapTrackingDataDetails {
    'data': EyeTapTrackingCounts;
    'timestamp': number;
    'elapsed': number;
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

    const res = await request.get( '/science' );

    previousEpochs = JSON.parse( res ? res : '[]' );
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
    start();
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

const getElapsedTime = (): number => {
    return ( new Date().getTime() - startTime ) / 1000;
};


/** Send the tracking data to the backend */
const send = () => {
    previousEpochs.push( {
        'data': getCounts(),
        'timestamp': new Date().getTime(),
        'elapsed': getElapsedTime()
    } );
    request.beaconRequest( '/analytics', JSON.stringify( previousEpochs ) );
    reset();
};

export default {
    get,
    getCounts,
    getElapsedTime,
    send,
    track,
    reset,
    start
};
