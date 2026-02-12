import {
    type Ref,
    onMounted
} from 'vue';

export const fixationRenderer = ( fixationsCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {
        if ( !ctx ) return;
    };

    onMounted( () => {
        ctx = fixationsCanvas.value!.getContext( '2d' )!;
        render();
    } );

    return {
        render
    };
};
