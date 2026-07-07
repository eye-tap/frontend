import {
    annotations
} from '../data';
import request from '@/ts/util/request';
import science from '@/ts/util/science';
import {
    showHintNotifications
} from '../config';
import {
    showPreAnnotations
} from '../config-presets';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    watch
} from 'vue';

const threshold = 15;

export const useHintNotificationSender = async () => {
    if ( !showPreAnnotations.value || !showHintNotifications ) return;

    const notifications = useNotification();

    let hasSent = true;

    const send = () => {
        if ( hasSent ) return;

        const counts = science.getCounts();

        if ( counts[ 'completion' ] === 0 ) {
            if ( annotations.value.length - counts[ 'disagreement-solution-bind' ] - counts[ 'disagreement-solution-click' ] > threshold ) {
                notifications.notify( {
                    'text': 'Remember that you can use "Space" to automatically create an assignment where only one suggestion exists',
                    'type': 'warn',
                    'title': 'Hint',
                    'duration': 20000
                } );

                request.updateUserOptions( 'hintSent', 'true' );
            }
        } else {
            hasSent = true;
            handle.stop();
        }
    };

    const handle = watch( annotations, send );

    if ( await request.getUserOptions( 'hintSent' ) === 'true' ) {
        handle.stop();
    } else {
        hasSent = false;
        console.log( '[HINTS] Setting up notification handler' );
    }
};
