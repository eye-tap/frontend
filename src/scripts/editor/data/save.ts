import {
    computed,
    ref
} from 'vue';

const savedRevision = ref( 0 );
const revision = ref( 0 );
const unsavedChanges = computed( () => {
    return revision !== savedRevision;
} );

const saveEditorChanges = () => {
    document.dispatchEvent( new CustomEvent( 'eyetap:save' ) );
};

export {
    savedRevision,
    revision,
    unsavedChanges,
    saveEditorChanges
};
