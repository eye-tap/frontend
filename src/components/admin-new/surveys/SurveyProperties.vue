<script setup lang="ts">
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import { useSurveyStore } from '@/ts/stores/admin';

    // TODO Download magic links from server to display (if this is supported)

    const surveyStore = useSurveyStore();
    const maxSurveyLength = 50;
    const notifications = useNotification();
    const devMode = import.meta.env.VITE_DEV_MODE;

    const removeSurvey = () => {
        // TODO in case the server ends up supporting this
        notifications.notify( {
            'text': 'Deletion not implemented',
            'type': 'error',
            'title': 'Not implemented'
        } );
    };

    const copyLinkToClipboard = ( linkStr: string ) => {
        navigator.clipboard.writeText( linkStr );
        notifications.notify( {
            'text': 'Copied magic link to clipboard',
            'type': 'success',
            'title': 'Copied'
        } );
    };

    const downloadMagicLinks = () => {
        const textContent = surveyStore.links.join( '\n' );
        const blob = new Blob(
            [ textContent ],
            {
                'type': 'text/plain'
            }
        );
        const url = URL.createObjectURL( blob );
        const a: HTMLAnchorElement = document.getElementById( 'linkDownloadAnchor' )! as HTMLAnchorElement;

        a.href = url;
        a.download = 'magicLinks.txt';
        a.click();
        URL.revokeObjectURL( url );
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

    if ( devMode ) useTestData();
</script>

<template>
    <div class="survey-properties">
        <div class="top-bar">
            <h2
                v-if="surveyStore.selectedSurveyID >= 0"
                class="title"
            >
                {{ truncate( surveyStore.getSelectedSurvey?.title!, maxSurveyLength ) }}
            </h2>
            <h2
                v-else
                class="title"
            >
                Survey Properties
            </h2>
            <div 
                v-if="surveyStore.selectedSurveyID >= 0"
                class="bar-buttons trash-icon"
            >
                <span>
                    <i
                        class="fa-solid fa-trash fa-lg trash-icon"
                        @click="removeSurvey"
                    ></i>
                </span>
            </div>
        </div>
        <div
            v-if="surveyStore.selectedSurveyID >= 0"
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
            <p class="subtitle">
                MAGIC LINKS
            </p>

            <div
                v-if="surveyStore.links.length > 0"
                class="link-table"
            >
                <table>
                    <tbody>
                        <tr
                            v-for="link, index in surveyStore.links"
                            :key="index"
                            @click="copyLinkToClipboard( link )"
                        >
                            <td>
                                <i class="fa-lg fa-regular fa-copy copy-icon"></i>
                                {{ truncate(link, 50) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-else
                class="placeholder"
            >
                <p>No Magic Links available</p>
            </div>
            <a id="linkDownloadAnchor">
                <button 
                    class="button primary"
                    :class="surveyStore.links.length > 0 ? 'undefined' : 'disabled'"
                    @click="downloadMagicLinks()"
                >
                    Download All
                </button>
            </a>
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

.survey-properties {
    >div.content {
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
        max-height: 70vh;

        >div.description-wrapper {
            margin-left: 1rem;
            margin-bottom: 1.5rem;
            width: max(300px, 40vw);

            overflow-y: auto;
            scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );

            >p {
                color: var(--theme-background-text-20);
                padding: 0px;
                margin: 0px;
            }
        }

        >div.properties-wrapper {
            margin-left: 1rem;
            margin-bottom: 1.5rem;

            >p {
                color: var(--theme-background-text-20);
                >strong {
                color: var(--theme-interactable-text);
                }
            }
        }

        >div.link-table {
            margin-left: 1rem;
            width: max(200px, 35vw);
            height: max(200px, 30vh);

            overflow-y: auto;
            scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
        }

        >a>button {
            margin-left: 1rem;
            margin-top: 2rem;
        }
    }
}
</style>