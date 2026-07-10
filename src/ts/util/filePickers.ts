import {
    type ComputedRef,
    type Ref,
    computed,
    ref,
    watch
} from 'vue';

// TODO: Expand
export const useFilePickerUtils = <T, C>(
    files: Ref<T[]>,
    compareFunc: ( sortColumn: C, ascending: boolean ) => ( a: T, b: T ) => number,
    fileSelect: ( file: T ) => void
) => {
    const sortColumn: Ref<C | 'none'> = ref( 'none' );
    const index = ref( -1 );
    const ascendingSort = ref( false );
    const sorted: ComputedRef<T[]> = computed( () => {
        if ( sortColumn.value === 'none' )
            return files.value;

        const toSort = [ ...files.value ];

        return toSort.sort( compareFunc( sortColumn.value, ascendingSort.value ) );
    } );

    watch( sorted, () => index.value = 0 );

    const setSorting = ( col: C ) => {
        if ( sortColumn.value === col ) {
            if ( ascendingSort.value )
                ascendingSort.value = false;
            else
                sortColumn.value = 'none';
        } else {
            ascendingSort.value = true;
            sortColumn.value = col;
        }
    };

    const selectFile = ( idx: number ) => {
        index.value = idx;
        fileSelect( sorted.value[idx]! );
    };

    return {
        sorted,
        setSorting,
        selectFile,
        sortColumn,
        ascendingSort,
        index
    };
};
