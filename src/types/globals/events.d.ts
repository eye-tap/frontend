import type {
    AnnotationDoneEvent,
    AnnotationSet
} from '../files';

declare global {
    interface GlobalEventHandlersEventMap {
        'eyetap:fileload': CustomEvent<AnnotationSet>;
        'eyetap:fileunload': CustomEvent<void>;
        'eyetap:save': CustomEvent<void>;
        'eyetap:undo': CustomEvent<void>;
        'eyetap:redo': CustomEvent<void>;
        'eyetap:annotation-done': CustomEvent<AnnotationDoneEvent>;
        'eyetap:keys:char': CustomEvent<void>;
        'eyetap:keys:next': CustomEvent<void>;
        'eyetap:keys:prev': CustomEvent<void>;
    }
}
