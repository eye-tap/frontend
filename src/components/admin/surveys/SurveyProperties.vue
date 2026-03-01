<script setup lang="ts">
    import {
        deleteSurvey,
        exportSurvey
    } from '@/ts/surveys';
    import {
        ref,
        watch
    } from 'vue';
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import {
        useRoute
    } from 'vue-router';
    import {
        useStatusStore
    } from '@/ts/stores/status';
    import {
        useSurveyStore
    } from '@/ts/stores/admin';

    const route = useRoute();
    const surveyStore = useSurveyStore();
    const maxSurveyLength = 50;
    const notifications = useNotification();
    const status = useStatusStore();
    const deleting = ref( false );
    const exporting = ref( false );

    const removeSurvey = () => {
        deleting.value = true;
        deleteSurvey( surveyStore.getSelectedSurveyID! )
            .then( ( success: boolean ) => {
                if ( success ) {
                    notifications.notify( {
                        'text': 'Survey was deleted successfuly',
                        'type': 'success',
                        'title': 'Survey Deleted'
                    } );
                    window.location.reload();
                } else {
                    deleting.value = false;
                    notifications.notify( {
                        'text': 'Survey could not be deleted',
                        'type': 'error',
                        'title': 'Error: Survey Deletion'
                    } );
                }
            } )
            .catch( e => {
                console.debug( e );
                deleting.value = false;
                notifications.notify( {
                    'text': 'Survey could not be deleted',
                    'type': 'error',
                    'title': 'Error: Survey Deletion'
                } );
            } );
    };

    const exportThisSurvey = () => {
        exporting.value = true;
        exportSurvey( surveyStore.getSelectedSurveyID! )
            .then( ( success: boolean ) => {
                exporting.value = false;

                if ( success )
                    notifications.notify( {
                        'text': 'Survey exported successfuly',
                        'type': 'success',
                        'title': 'Survey Export'
                    } );
                else
                    notifications.notify( {
                        'text': 'Survey could not be exported',
                        'type': 'error',
                        'title': 'Error: Survey Export'
                    } );
            } )
            .catch( e => {
                console.debug( e );
                exporting.value = false;
                notifications.notify( {
                    'text': 'Survey could not be exported',
                    'type': 'error',
                    'title': 'Error: Survey Export'
                } );
            } );
    };

    const truncate = ( text: string, limit: number ) => {
        if ( text.length < limit ) return text;
        else return text.slice( 0, limit - 3 ) + '...';
    };

    const useTestData = () => {
        let links = [];

        for ( let i = 0; i < 20; i++ )
            links.push( 'link' + String( i ) );

        links.push( 'linkWhichIsVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLong' );
        surveyStore.setLinks( links );

        notifications.notify( {
            'text': 'Populated link list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
    };

    /**
     *  Selected survey is derived via route (contains unique survey id)
     */
    watch(
        () => route.params.id,
        newId => {
            console.log( newId );

            if ( newId === undefined ) surveyStore.setSurveyIndex( -1 );
            else surveyStore.setSurveyIndexById( parseInt( newId as string ) );
        }
    );

    if ( status.devMode ) useTestData();
</script>

<template>
    <div class="survey-properties">
        <div class="top-bar">
            <h2
                v-if="surveyStore.selectedSurveyIndex >= 0"
                class="title"
            >
                {{ truncate(surveyStore.getSelectedSurvey?.title!, maxSurveyLength) }}
            </h2>
            <h2
                v-else
                class="title"
            >
                Survey Properties
            </h2>
            <div
                v-if="surveyStore.selectedSurveyIndex >= 0"
                class="bar-buttons"
            >
                <span
                    :class="deleting ? 'progress-active' : ''"
                >
                    <i
                        class="fa-solid fa-trash fa-lg trash-icon"
                        @click="removeSurvey"
                    ></i>
                </span>
                <span
                    :class="exporting ? 'progress-active' : ''"
                >
                    <i
                        class="fa-solid fa-download fa-lg dl-icon"
                        @click="exportThisSurvey"
                    ></i>
                </span>
            </div>
        </div>
        <div
            v-if="surveyStore.selectedSurveyIndex >= 0"
            class="content"
        >
            <p class="subtitle">
                DESCRIPTION
            </p>
            <div class="description-wrapper">
                <p>
                    {{ surveyStore.getSelectedSurvey?.description! }}
                </p>
            </div>
            <p class="subtitle">
                PROPERTIES
            </p>
            <div class="properties-wrapper">
                <p>Users: <strong> {{ surveyStore.getSelectedSurvey?.userIds?.length }} </strong></p>
            </div>
        </div>
        <div
            v-else
            class="placeholder"
        >
            <p>Select a Survey to view properties</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/admin/general';
@use '@/scss/admin/top-bar';

@keyframes progressing-bounce {
    0% {
        transform: scale(1);
    }
    30% {
        transform: scale(0.9);
    }
    50% {
        transform: scale(1.25);
    }
    70% {
        transform: scale(0.9);
    }
}

.progress-active {
    animation: progressing-bounce 0.5s linear infinite;
}


.survey-properties {
  // Mainly for wide displays
  .top-bar {
    justify-content: left;
  }

  > div.content {
    overflow-y: auto;
    scrollbar-color: var(--theme-interactable-text) var(--theme-bg-3);
    max-height: 70vh;

    > div.description-wrapper {
      margin-left: 1rem;
      margin-bottom: 1.5rem;
      width: max(300px, 40vw);

      overflow-y: auto;
      scrollbar-color: var(--theme-interactable-text) var(--theme-bg-3);

      > p {
        color: var(--theme-background-text-20);
        padding: 0px;
        margin: 0px;
      }
    }

    > div.properties-wrapper {
      margin-left: 1rem;
      margin-bottom: 1.5rem;

      > p {
        color: var(--theme-background-text-20);

        > strong {
          color: var(--theme-interactable-text);
        }
      }
    }

    > div.link-table {
      margin-left: 1rem;
      width: max(200px, 35vw);
      height: max(200px, 30vh);

      overflow-y: auto;
      scrollbar-color: var(--theme-interactable-text) var(--theme-bg-3);
    }

    > a > button {
      margin-left: 1rem;
      margin-top: 2rem;
    }
  }
}
</style>
