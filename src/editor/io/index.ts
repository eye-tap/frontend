import type {
    Ref
} from 'vue';
import type {
    Renderer
} from '../types/renderer';
import {
    keyboardHandler
} from './keyboard';
import {
    mouseHandler
} from './mouse';


/** Starts the IO handler  */
export const ioHandler = ( clickTarget: Ref<HTMLElement | null>, renderer: Renderer ) => {
    mouseHandler( clickTarget );
    keyboardHandler( renderer );
};
