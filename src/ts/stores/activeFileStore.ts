import {
    defineStore
} from 'pinia';

interface ActiveFile {
    'sessionIdx': number;
    'sessionIds': number[];
    'selected': boolean;
}

export const useActiveFileStore = defineStore( 'file', {
    'state': (): ActiveFile => ( {
        'sessionIdx': 0,
        'sessionIds': [],
        'selected': false
    } ),
    'getters': {
        'getSessionIds': state => state.sessionIds,
        'getIsSelected': state => state.selected
    },
    'actions': {
        setIds ( sessionIds: number[] ) {
            this.sessionIds = sessionIds;
        },
        setActive ( idx: number ) {
            this.sessionIdx = idx;
            this.selected = true;
        }
    }
} );
