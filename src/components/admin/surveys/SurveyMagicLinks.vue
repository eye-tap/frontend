<script setup lang="ts">
    import {
        useNotification
    } from '@kyvg/vue3-notification';
    import {
        useStatusStore
    } from '@/ts/stores/status';
    import {
        useSurveyStore
    } from '@/ts/stores/admin';

    const surveyStore = useSurveyStore();
    const notifications = useNotification();
    const status = useStatusStore();

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

    if ( status.devMode ) useTestData();
</script>

<template>
    <div class="magic-links">
        <div class="top-bar">
            <h2 class="title">
                Magic Links
            </h2>
        </div>
        <div class="content">
            <p class="warn-text">
                <strong>WARNING</strong> Magic Links are only shown once after creation.
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
                <p>Select a Survey to view properties</p>
            </div>
            <a id="linkDownloadAnchor">
                <button
                    class="button primary"
                    :class="surveyStore.links.length > 0 ? 'undefined' : 'disabled'"
                    @click="surveyStore.links.length > 0 ? downloadMagicLinks() : 'undefined'"
                >
                    Download Links
                </button>
            </a>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/scss/admin/general';
@use '@/scss/admin/top-bar';

.magic-links {
    // Mainly for wide displays
    .top-bar {
        justify-content: left;
    }

    .warn-text {
        font-size: 1rem;
        color: var(--theme-bg-3-20);
        margin: 1rem;
    }

    strong {
        color: var(--theme-warning);
        background-color: var(--theme-bg-1-shade);
        padding: 0.7rem;
        border-radius: 10px;
    }

    >div.content {
        overflow-y: auto;
        scrollbar-color: var( --theme-interactable-text ) var( --theme-bg-3 );
        max-height: 70vh;

        >div.link-table {
            margin-left: 1rem;
            width: max(200px, 35vw);
            height: max(200px, 50vh);

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
