import annotations from '@/ts/annotations';
import {
    useActiveFileStore
} from '@/ts/stores/activeFileStore';

const loadEditorDataFromBackend = async () => {
    const session = useActiveFileStore();
    const data = await annotations.getSessionById( session.sessionIds[ session.sessionIdx ]! );
    // TODO: Load image into image object (do NOT modify onload!!)
    // TODO: Get annotations into EditorAnnotation[] format
    // TODO: Get bounding boxes into EditorCharacterBoundingBoxes[] format
    // TODO: Get fixations into EditorFixation[] format
};
