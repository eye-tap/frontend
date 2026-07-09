import {
    type ComputedRef,
    type Ref,
    computed,
    ref,
    watch
} from 'vue';

// TODO: Expand
export const useFilePickerUtils = <T, C>( files: Ref<T[]>, compareFunc: ( a: T, b: T ) => number ) => {
    const sortColumn: Ref<C | 'none'> = ref( 'none' );
    const selectedFileIndex = ref( -1 );
    const ascendingSort = ref( false );
    const sorted = computed( () => {

    } );
    const sortedList: ComputedRef<T[]> = computed( () => {
        if ( sortColumn.value === 'none' )
            return files.value;

        const toSort = [ ...files.value ];

        return toSort.sort( compareFunc );
    } );

    watch( sortedList, () => selectedFileIndex.value = 0 );

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

    return {
        sorted,
        setSorting
    };
};
