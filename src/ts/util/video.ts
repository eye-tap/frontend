const THRESHOLD = 0.6;

export const startVideoChecker = ( id: string ) => {
    const el = document.getElementById( id ) as HTMLVideoElement;
    const duration = el.duration;

    let watchedDuration = 0;
    let segmentStart = 0;


    el.onseeking = () => {
        watchedDuration += el.currentTime - segmentStart;
    };

    el.onseeked = () => {
        segmentStart = el.currentTime;
    };

    const validate = () => {
        return watchedDuration > duration * THRESHOLD;
    };

    return validate;
};
