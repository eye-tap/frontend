import {
    type Ref,
    onMounted
} from 'vue';

export const fixationRenderer = ( fixationsCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {

    };

    onMounted( () => {
        ctx = fixationsCanvas.value!.getContext( '2d' )!;
    } );

    return {
        render
    };
};
