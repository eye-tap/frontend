import type {
    ShallowAnnotationSessionDto
} from '@/types/dtos/ShallowAnnotationSessionDto';
import {
    defineStore
} from 'pinia';

interface ActiveFile {
    'session': ShallowAnnotationSessionDto;
    'selected': boolean
}

export const useActiveFileStore = defineStore( 'file', {
    'state': (): ActiveFile => ( {
        'session': {
            'id': 0
        },
        'selected': false
    } ),
    'getters': {
        'getFile': state => state.session
    },
    'actions': {
        setActiveFile ( file: ShallowAnnotationSessionDto ) {
            this.session = file;
            this.selected = true;
        }
    }
} );
