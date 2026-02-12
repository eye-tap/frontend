import {
    type Ref,
    onMounted
} from 'vue';

export const boxesRenderer = ( boxesCanvas: Ref<HTMLCanvasElement | null>, image: HTMLImageElement ) => {
    let ctx: CanvasRenderingContext2D | null = null;

    const render = () => {

    };

    onMounted( () => {
        ctx = boxesCanvas.value!.getContext( '2d' )!;
    } );

    return {
        render
    };
};
