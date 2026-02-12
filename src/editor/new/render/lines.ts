import {
    type Ref,
    onMounted
} from 'vue';

export const linesRenderer = ( linesCanvas: Ref<HTMLCanvasElement | null> ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {

    };

    onMounted( () => {
        ctx = linesCanvas.value!.getContext( '2d' )!;
    } );

    return {
        render
    };
};
