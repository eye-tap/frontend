import type {
    AnnotationSet
} from '../files';

declare global {
    interface GlobalEventHandlersEventMap {
        'eyetap:fileload': CustomEvent<AnnotationSet>
        'eyetap:save': CustomEvent<void>
        'eyetap:undo': CustomEvent<void>
        'eyetap:redo': CustomEvent<void>
    }
}
