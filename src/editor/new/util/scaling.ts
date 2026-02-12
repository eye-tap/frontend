import {
    canvasSize
} from '../data';
import {
    ref
} from 'vue';

export const scalingFactor = ref( 1 );

export const computeScaleFactor = ( original: number, target: number, aspect: number ) => {
    scalingFactor.value = Math.round( target / original * 1000 ) / 1000;
    canvasSize.value.width = original * scalingFactor.value;
    canvasSize.value.height = canvasSize.value.width * aspect;
};

export const scale = ( value: number ) => {
    return Math.round( value * scalingFactor.value );
};

export const scaleInverse = ( value: number ) => {
    return Math.round( value / scalingFactor.value );
};
