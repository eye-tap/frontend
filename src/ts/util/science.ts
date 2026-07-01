import request from './request';

export type EyeTapTrackingEvents = 'undo-redo' | 'completion'
    | 'disagreement-solution-click' | 'disagreement-solution-bind'
    | 'zoom' | 'scanpath-move'; // if we do colorblind mode, then this

export type EyeTapTrackingData = {
    [key in EyeTapTrackingEvents]: number[]
};

export type EyeTapTrackingCounts = {
    [key in EyeTapTrackingEvents]: number
};

let data: EyeTapTrackingData = {
    'undo-redo': [],
    'completion': [],
    'zoom': [],
    'disagreement-solution-click': [],
    'disagreement-solution-bind': [],
    'scanpath-move': []
};


/** Reset the tracking data. Automatically called by the send function */
const reset = () => {
    data = {
        'undo-redo': [],
        'completion': [],
        'zoom': [],
        'disagreement-solution-click': [],
        'disagreement-solution-bind': [],
        'scanpath-move': []
    };
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
        'scanpath-move': 0
    };

    for ( const key in data ) {
        counts[ key as EyeTapTrackingEvents ] = data[ key as EyeTapTrackingEvents ]!.length;
    }

    return counts;
};


/** Send the tracking data to the backend */
const send = () => {
    request.post( '/science', data );
};

export default {
    get,
    getCounts,
    send,
    track,
    reset
};
