import type {
    AnnotationSet
} from '@/definitions/files';
import {
    defineStore
} from 'pinia';

interface ActiveFile {
    'file': AnnotationSet;
    'fileSelected': boolean
}

export const useActiveFileStore = defineStore( 'file', {
    'state': (): ActiveFile => ( {
        'file': {
            'id': 0,
            'baseName': 'Test',
            'files': {},
            'progress': {
                'uploaded': new Date().getTime() - 100,
                'id': 0,
                'assigned': 100,
                'wordCount': 200,
                'gazePoints': 175,
                'modified': new Date().getTime()
            }
        },
        'fileSelected': false
    } ),
    'getters': {
        'getFile': state => state.file
    },
    'actions': {
        setActiveFile ( file: AnnotationSet ) {
            this.file = file;
            this.fileSelected = true;
        }
    }
} );
