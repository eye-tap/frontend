const redo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:redo' ) );
};

const undo = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:undo' ) );
};

export {
    undo,
    redo
};
