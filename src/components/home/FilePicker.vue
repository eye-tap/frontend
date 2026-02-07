<script setup lang="ts">
    import {
        type ComputedRef,
        type Ref,
        computed,
        ref,
        watch
    } from 'vue';
    import type {
        AnnotationSet
    } from '@/definitions/files';
    import {
        formatDateTime
    } from '@/scripts/util/date';
    import {
        useActiveFileStore
    } from '@/stores/activeFileStore';

    type sortColumns = 'none' | 'baseName' | 'modified' | 'wordCount';

    const props = defineProps<{
        'files': AnnotationSet[],
        'loading': boolean,
        'lastLogin': number
    }>();
    const emits = defineEmits<{
        ( e: 'fileSelect', file: AnnotationSet ): void
        ( e: 'reloadFiles' ): void
    }>();
    const ascendingSort = ref( true );
    const sortColumn: Ref<sortColumns> = ref( 'none' );
    const selectedFileIndex = ref( 0 );
    const activeFile = useActiveFileStore();
    const sortedList: ComputedRef<AnnotationSet[]> = computed( () => {
        if ( sortColumn.value === 'none' ) {
            return props.files;
        }

        const toSort = [ ...props.files ];

        return toSort.sort( compareFunc );
    } );

    watch( sortedList, () => selectedFileIndex.value = 0 );

    const setSorting = ( col: sortColumns ) => {
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

    const compareFunc = ( a: AnnotationSet, b: AnnotationSet ) => {
        if ( sortColumn.value === 'none' ) return 1;

        if ( sortColumn.value === 'modified' || sortColumn.value === 'wordCount' ) {
            if ( !a.progress && b.progress ) return sortPredicate( !ascendingSort.value );

            if ( a.progress && !b.progress ) return sortPredicate( ascendingSort.value );

            if ( !a.progress && !b.progress ) return sortPredicate( !ascendingSort.value );

            if ( !ascendingSort.value )
                return sortPredicate( a[ 'progress' ]![ sortColumn.value ] < b[ 'progress' ]![ sortColumn.value ] );
            else
                return sortPredicate( b[ 'progress' ]![ sortColumn.value ] < a[ 'progress' ]![ sortColumn.value ] );
        } else {
            if ( !ascendingSort.value )
                return a[ sortColumn.value ] < b[ sortColumn.value ] ? 1 : -1;
            else
                return a[ sortColumn.value ] < b[ sortColumn.value ] ? -1 : 1;
        }
    };

    const sortPredicate = ( predicate: boolean ) => {
        return predicate ? 1 : -1;
    };

    const selectFile = ( index: number ) => {
        selectedFileIndex.value = index;
        emits( 'fileSelect', sortedList.value[ index ]! );
    };

    const reloadFromServer = () => {
        emits( 'reloadFiles' );
    };
</script>

<template>
    <div class="file-picker">
        <div class="file-picker-title">
            <span>
                <i class="fa-xl fa-solid fa-file"></i>
                <p>Select a file to annotate</p>
                <i v-if="$props.loading" class="fa-xl fa-solid fa-circle-notch loading-spinner"></i>
            </span>
            <div>
                <i class="fa-lg fa-solid fa-arrows-rotate refresh-icon" @click="reloadFromServer()"></i>
            </div>
        </div>
        <div class="table-wrapper">
            <table v-if="sortedList.length > 0">
                <thead>
                    <tr>
                        <th class="file-name" @click="setSorting( 'baseName' )">
                            <div>
                                Name
                                <span
                                    v-if="sortColumn === 'baseName'"
                                    :class="['material-symbols-outlined', 'sort', ascendingSort ? 'ascending' : undefined]"
                                >arrow_drop_down</span>
                            </div>
                        </th>
                        <th class="file-modified" @click="setSorting( 'modified' )">
                            <div>
                                Date modified
                                <span
                                    v-if="sortColumn === 'modified'"
                                    :class="['material-symbols-outlined', 'sort', ascendingSort ? 'ascending' : undefined]"
                                >arrow_drop_down</span>
                            </div>
                        </th>
                        <th class="file-size" @click="setSorting( 'wordCount' )">
                            <div>
                                Words
                                <span
                                    v-if="sortColumn === 'wordCount'"
                                    :class="['material-symbols-outlined', 'sort', ascendingSort ? 'ascending' : undefined]"
                                >arrow_drop_down</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="file, index in sortedList"
                        :key="file.id"
                        :class="index === selectedFileIndex && activeFile.fileSelected ? 'selected' : ''"
                        @click="selectFile( index )"
                    >
                        <td class="file-name">
                            {{ file.baseName }} {{ lastLogin < file.progress!.uploaded ? '(New)' : '' }}
                        </td>
                        <td class="file-modified">
                            {{ file.progress ? formatDateTime( new Date( file.progress.modified ) ) : 'Not modified' }}
                        </td>
                        <td class="file-size">
                            {{ file.progress ? file.progress.wordCount : 'N/A' }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>No Files on the server</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/home-boxes.scss' as *;

.file-picker {
    @include home-boxes();
    user-select: none;
    background-color: var(--theme-bg-2);
    padding-top: 0.5rem;
    border-radius: 0px 0px 20px 20px;

    .file-picker-title {
        background-color: var(--theme-bg-2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0px;

        @keyframes rotating {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .loading-spinner {
            color: var(--theme-bg-4);
            margin-left: 1rem;
            animation: rotating 2s linear infinite;
        }

        .left {
            border-radius: 15px 0px 0px 15px;
        }

        .right {
            border-radius: 0px 15px 15px 0px;
        }

        >div {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .refresh-icon {
                margin-right: 10px;
                cursor: pointer;
                color: var(--theme-bg-4);

                &:hover {
                    color: var(--theme-bg-4-20);
                }

                &:focus {
                    animation: rotating 1s linear 1;
                }
            }
        }

        >span {
            display: flex;
            align-items: center;
            justify-content: space-between;

            color: var(--theme-bg-5);
            padding-left: 0px;
            margin-left: 0px;

            >p {
                padding-left: 0.75rem;
                font-size: 1.25rem;
                color: var(--theme-foreground-text);
            }
        }
    }

    .file-picker-mode {
        display: flex;
        >label {

            padding: 10px;
            background-color: var( --theme-bg-3 );
            transition: background-color 0.25s;
            cursor: pointer;

            &.selected {
                background-color: var( --theme-bg-4 );
                cursor: unset;
            }

            >p {
                margin: 0;
            }
            >input {
                display: none;
            }
        }
    }

    .table-wrapper {
        background-color: var(--theme-bg-1);
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        width: 95%;

        >div {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 5rem;
            padding-bottom: 5rem;

            >p {
                color: var(--theme-background-text-20);
            }
        }

        >table {
            width: 100%;
            table-layout: auto;
            border-spacing: 0 15px;

            >thead {
                border-spacing: 0;

                >tr {
                    >th {
                        cursor: pointer;
                        color: var(--theme-bg-3);

                        >div {
                            display: flex;
                            justify-content: start;
                            align-items: center;

                            .sort {
                                rotate: 0deg;
                                transition: rotate 0.25s linear;
                                height: 1.25rem;
                                width: 1.25rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                &.ascending {
                                    rotate: 180deg;
                                }
                            }
                        }
                    }
                }
            }

            >tbody {
                overflow: scroll;
                scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
                >tr {
                    &:hover {
                        >td {
                            background-color: var( --theme-bg-3-shade );
                            color: var(--theme-interactable-text);
                        }
                    }

                    &.selected {
                        >td {
                            background-color: var( --theme-bg-3 );
                            color: var(--theme-foreground-text);
                        }
                    }

                    >td {
                        padding: 15px 0;
                        width: max-content;
                        background-color: var( --theme-bg-2 );
                        color: var(--theme-background-text-20);
                        margin-top: 5px;
                        cursor: pointer;
                    }

                    >.file-name {
                        width: 70%;
                        padding-left: 15px;
                        color: var(--theme-interactable-text);
                    }

                    >.file-size {
                        padding-right: 15px;
                    }
                }
            }
        }
    }
}
</style>
