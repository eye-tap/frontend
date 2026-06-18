import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const sendLoadEvent = ( title: string ) => {
    const session = useAnnotationSessionStore();

    document.dispatchEvent( new CustomEvent( 'eyetap:file:load', {
        'detail': {
            'idx': session.sessionIdx,
            'title': title
        }
    } ) );
};

export const sendEditorLeaveEvent = () => {
    const session = useAnnotationSessionStore();

    session.selected = false;

    document.dispatchEvent( new CustomEvent( 'eyetap:file:unload' ) );
};
