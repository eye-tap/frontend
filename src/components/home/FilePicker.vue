<script setup lang="ts">
    import {
        type ComputedRef,
        type Ref,
        computed,
        ref,
        watch
    } from 'vue';
    import type {
        ShallowAnnotationSessionDto
    } from '@/types/dtos/ShallowAnnotationSessionDto';
    import {
        useAnnotationSessionStore
    } from '@/ts/stores/annotationSessionStore';

    type sortColumns = 'none' | 'total' | 'done';

    const props = defineProps<{
        'files': ShallowAnnotationSessionDto[],
        'loading': boolean,
    }>();
    const emits = defineEmits<{
        ( e: 'fileSelect', file: ShallowAnnotationSessionDto ): void
        ( e: 'reloadFiles' ): void
    }>();
    const ascendingSort = ref( true );
    const sortColumn: Ref<sortColumns> = ref( 'none' );
    const selectedFileIndex = ref( 0 );
    const session = useAnnotationSessionStore();
    const sortedList: ComputedRef<ShallowAnnotationSessionDto[]> = computed( () => {
        if ( sortColumn.value === 'none' )
            return props.files;

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

    // Sorting by name requires bigger rewrite since name isn't in annotationsDataSet
    const compareFunc = ( a: ShallowAnnotationSessionDto, b: ShallowAnnotationSessionDto ) => {
        // Sort by text name, then reader
        if ( sortColumn.value === 'total' || sortColumn.value === 'done' ) {
            if ( !a.annotationsMetaData && b.annotationsMetaData ) return sortPredicate( !ascendingSort.value );

            if ( a.annotationsMetaData && !b.annotationsMetaData ) return sortPredicate( ascendingSort.value );

            if ( !a.annotationsMetaData && !b.annotationsMetaData ) return sortPredicate( !ascendingSort.value );

            if ( !ascendingSort.value )
                return sortPredicate( a['annotationsMetaData']![sortColumn.value]! < b['annotationsMetaData']![sortColumn.value]! );
            else
                return sortPredicate( b['annotationsMetaData']![sortColumn.value]! < a['annotationsMetaData']![sortColumn.value]! );
        } else {
            return 1;
        }
    };

    const sortPredicate = ( predicate: boolean ) => {
        return predicate ? 1 : -1;
    };

    const selectFile = ( index: number ) => {
        selectedFileIndex.value = index;
        emits( 'fileSelect', sortedList.value[index]! );
    };

    const reloadFromServer = () => {
        emits( 'reloadFiles' );
    };
</script>

<template>
    <div class="file-browser">
        <div class="file-picker-title">
            <span>
                <i class="fa-xl fa-solid fa-file"></i>
                <p>Select a file to annotate</p>
                <i v-if="$props.loading" class="fa-xl fa-solid fa-circle-notch loading-spinner"></i>
            </span>
            <div>
                <span class="refresh-icon">
                    <i class="fa-lg fa-solid fa-arrows-rotate" @click="reloadFromServer()"></i>
                </span>
            </div>
        </div>
        <div class="table-wrapper">
            <table v-if="sortedList.length > 0">
                <thead>
                    <tr>
                        <th class="file-name">
                            <div>
                                Name
                            </div>
                        </th>
                        <th class="gazepoints clickable" @click="setSorting( 'total' )">
                            <div>
                                Fixations
                                <span
                                    v-if="sortColumn === 'total'"
                                    :class="['material-symbols-outlined', 'sort', ascendingSort ? 'ascending' : undefined]"
                                >arrow_drop_down</span>
                            </div>
                        </th>
                        <th class="assigned clickable" @click="setSorting( 'done' )">
                            <div>
                                Assigned
                                <span
                                    v-if="sortColumn === 'done'"
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
                        :class="index === selectedFileIndex && session.selected ? 'selected' : ''"
                        @click="selectFile( index )"
                    >
                        <td class="file-name">
                            {{ file.readingSession?.textTitle }}, reader {{ file.readingSession?.reader }}
                        </td>
                        <td class="gazepoints">
                            {{
                                file.annotationsMetaData?.total != null
                                    ? file.annotationsMetaData.total : 'Not modified'
                            }}
                        </td>
                        <td class="assigned">
                            {{
                                file.annotationsMetaData?.done != null
                                    ? file.annotationsMetaData.done : 'Not modified'
                            }}
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

.file-browser {
  @include home-boxes();
  user-select: none;
  background-color: var(--theme-bg-2);
  padding-top: 0.5rem;
  margin-left: 1rem;
  border-radius: 20px;
  width: 45vw;

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

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .refresh-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        height: 30px;
        width: 30px;
        cursor: pointer;

        > i {
          transition: rotate 0.2s;
          color: var(--theme-foreground-text);

          &:hover {
            color: var(--theme-bg-4-20);
            rotate: 135deg;
          }

          &:focus {
            color: var(--theme-bg-4-20);
            animation: rotating 1s linear 1;
          }
        }
      }
    }

    > span {
      display: flex;
      align-items: center;
      justify-content: space-between;

      color: var(--theme-bg-5);
      padding-left: 0px;
      margin-left: 0px;

      > p {
        padding-left: 0.75rem;
        font-size: 1.25rem;
        color: var(--theme-foreground-text);
      }
    }
  }

  .file-picker-mode {
    display: flex;

    > label {

      padding: 10px;
      background-color: var(--theme-bg-3);
      transition: background-color 0.25s;
      cursor: pointer;

      &.selected {
        background-color: var(--theme-bg-4);
        cursor: unset;
      }

      > p {
        margin: 0;
      }

      > input {
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
    height: 70vh;
    overflow-y: scroll;
    scrollbar-color: var(--theme-bg-4) var(--theme-bg-3);

    .clickable {
      cursor: pointer;
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 5rem;
      padding-bottom: 5rem;

      > p {
        color: var(--theme-background-text-20);
      }
    }

    > table {
      width: 100%;
      table-layout: auto;
      border-spacing: 0 15px;

      > thead {
        border-spacing: 0;

        > tr {
          > th {
            color: var(--theme-bg-3);

            > div {
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

      > tbody {
        > tr {
          &:hover {
            > td {
              background-color: var(--theme-bg-3-shade);
              color: var(--theme-interactable-text);
            }
          }

          &.selected {
            > td {
              background-color: var(--theme-bg-3);
              color: var(--theme-foreground-text);
            }
          }

          > td {
            padding: 15px 0;
            background-color: var(--theme-bg-2);
            color: var(--theme-background-text-20);
            margin-top: 5px;
            cursor: pointer;
          }

          > .gazepoints {
            width: 13%;
            text-align: right;
            padding-right: 1rem;
          }

          > .assigned {
            width: 13%;
            text-align: right;
            padding-right: 1rem;
          }

          > .file-name {
            width: 60%;
            padding-left: 15px;
            color: var(--theme-interactable-text);
          }

          > .file-size {
            width: 10%;
            text-align: right;
            padding-right: 2rem;
          }
        }
      }
    }
  }
}
</style>
