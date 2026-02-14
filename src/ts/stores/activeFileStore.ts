import {
    defineStore
} from 'pinia';

interface ActiveFile {
    'sessionId': number;
    'selected': boolean;
}

export const useActiveFileStore = defineStore( 'file', {
    'state': (): ActiveFile => ( {
        'sessionId': 0,
        'selected': false
    } ),
    'getters': {
        'getSessionId': state => state.sessionId,
        'getIsSelected': state => state.selected
    },
    'actions': {
        setActiveFile ( sessionId: number ) {
            this.sessionId = sessionId;
            this.selected = true;
        }
    }
} );
