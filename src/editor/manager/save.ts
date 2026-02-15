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
    annotations
} from '../data';
import {
    useActiveFileStore
} from '@/ts/stores/activeFileStore';

export const revision = ref( 0 );

export const useSaveFunction = () => {
    const session = useActiveFileStore();

    const save = () => {
        const data: EditAnnotationsDto = {
            'annotations': {}
        };

        annotations.value.map( val => {
            data.annotations![ val.fixationId ] = val.boxId;
        } );
        annotation.save( data, session.sessionIds[ session.sessionIdx ]! );
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:save', save );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:save', save );
    } );
};
