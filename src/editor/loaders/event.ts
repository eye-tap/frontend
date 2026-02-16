import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const sendLoadEvent = ( title: string ) => {
    const session = useAnnotationSessionStore();

    document.dispatchEvent( new CustomEvent( 'eyetap:fileload', {
        'detail': {
            'idx': session.sessionIdx,
            'title': title
        }
    } ) );
};

export const sendEditorLeaveEvent = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:fileunload' ) );
};
