export interface EditAnnotationsDto {
    'annotations'?: Record<string, unknown>;
    'fixationsToRemove'?: number[];
    'annotationsToRemove'?: Record<string, unknown>;
    'fixationsToUndoRemove'?: number[];
}
