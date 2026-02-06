import {
    ref
} from 'vue';

const scalingFactor = ref( 1 );

const computeScaleFactor = ( original: number, target: number ) => {
    scalingFactor.value = Math.round( target / original * 1000 ) / 1000;
};

const scale = ( value: number ) => {
    return Math.round( value * scalingFactor.value );
};

const scaleInverse = ( value: number ) => {
    return Math.round( value / scalingFactor.value );
};

export {
    computeScaleFactor,
    scalingFactor,
    scale,
    scaleInverse
};
