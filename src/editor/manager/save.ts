import {
    onMounted,
    onUnmounted,
    ref
} from 'vue';
import {
    annotations
} from '../data';

export const revision = ref( 0 );

export const useSaveFunction = () => {
    const save = () => {
        // TODO: Export data
        // Below to be converted into correct dto
        // (check http://localhost:8080/swagger-ui/index.html with backend running for which one it is)
        // It should be EditAnnotationDto
        console.log( 'DATA EXPORT', annotations.value );
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:save', save );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save', save );
    } );
};
