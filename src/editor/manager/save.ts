import {
    annotations,
    boundingBoxes,
    fixations
} from '../data';
import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import type {
    EditAnnotationsDto
} from '@/types/dtos/EditAnnotationsDto';
import annotation from '@/ts/annotations';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const revision = ref( 0 );

export const useSaveFunction = () => {
    const session = useAnnotationSessionStore();

    const save = () => {
        const data: EditAnnotationsDto = {
            'annotations': {}
        };
        console.log("Trying to save annotations");
        // Translate to correct ids
        annotations.value.forEach( val => {
            data.annotations![ fixations.value[ val.fixationId ]!.id! ] = boundingBoxes.value[ val.boxId ]!.id!;
        } );
        console.log("Edited annotations: " + data);
        annotation.save(data, session.sessionIds[session.sessionIdx]!.sessionId).then();
     };

    onMounted( () => {
        console.log("Registering eyetap:save listener")
        document.addEventListener( 'eyetap:save', save );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save', save );
    } );
};
