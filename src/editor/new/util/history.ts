import {
    type Ref,
    ref
} from 'vue';

interface RedoHistoryEntry {
    'index': number;
    'annotatedBox': string | number | null;
    'currentIndex': number;
}

export const redoHistory: Ref<RedoHistoryEntry[]> = ref( [] );

export const undoHistory: Ref<number[]> = ref( [] );
