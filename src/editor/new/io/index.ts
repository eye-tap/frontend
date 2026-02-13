import type {
    Ref
} from 'vue';
import {
    mouseHandler
} from './mouse';

export const ioHandler = ( clickTarget: Ref<HTMLElement | null> ) => {
    mouseHandler( clickTarget );
};
