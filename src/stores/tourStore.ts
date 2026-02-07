import {
    defineStore
} from 'pinia';

interface TourStore {
    'isShown': boolean;
    'currentIndex': number;
    'tourItemTotal': number;
}

export const useTourStore = defineStore( 'tour', {
    'state': (): TourStore => ( {
        'isShown': false,
        'currentIndex': 0,
        'tourItemTotal': 0
    } ),
    'getters': {
        'getCurrentIndex': state => state.currentIndex,
        'getShown': state => state.isShown
    },
    'actions': {
        startTour () {
            this.isShown = true;
        },
        nextTourElement () {
            this.currentIndex += this.currentIndex < this.tourItemTotal - 1 ? 1 : 0;
        },
        previousTourElement () {
            this.currentIndex -= this.currentIndex > 0 ? 1 : 0;
        },
        endTour () {
            this.isShown = false;
        },
        setTourItemTotal ( total: number ) {
            this.tourItemTotal = total;
        }
    }
} );
