import type {
    Ref
} from 'vue';

export const ioHandler = ( clickTarget: Ref<HTMLDivElement | null> ) => {
    console.log( clickTarget );
};
