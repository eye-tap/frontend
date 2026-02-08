import {
    computed
} from 'vue';
import {
    tourConfig
} from './tourBackend';

let currentIndex = 0;
let isTourShown = false;
let tourElements: HTMLElement[] = [];


const assignTourClasses = ( id: number, extraClasses: string ) => {
    return computed( () => {
        if ( id === currentIndex && isTourShown ) {
            return 'page-tour shown' + ( extraClasses !== '' ? ' ' + extraClasses : '' );
        } else {
            return 'page-tour' + ( extraClasses !== '' ? ' ' + extraClasses : '' );
        }
    } );
};


const startTour = () => {
    currentIndex = 0;
    isTourShown = true;
    tourElements = [];
    const els = document.getElementsByClassName( 'page-tour' );

    for ( let i = 0; i < els.length; i++ ) {
        const el = els[ i ]! as HTMLElement;

        if ( el.dataset[ 'tour-index' ] ) {
            tourElements.push( );
        } else {
            console.warn( 'Element was ommitted for the tour due to missing dataset. The element:', el );
        }
    }

    tourElements.sort( ( el1, el2 ) => {
        return parseInt( el1.dataset[ 'tour-index' ]! ) - parseInt( el2.dataset[ 'tour-index' ]! );
    } );

    positionToolTipForElement( tourElements[ currentIndex ]! );
};

const goToNextTourElement = () => {

};

const goToPreviousTourElement = () => {

};


const positionToolTipForElement = ( el: HTMLElement ) => {
    // TODO: Block scrolling
    const pos = tourElements[ currentIndex ]!.getBoundingClientRect();
    const posX = pos.left > 230;
    const posY = 0;

    // Might need to consider scroll position when setting the position
    tourConfig.value = {
        'shown': true,
        'x': posX,
        'y': posY,
        'title': el.dataset[ 'page-tour-title' ]!,
        'desc': el.dataset[ 'page-tour-description' ]!
    };
};


export default {
    assignTourClasses,
    startTour,
    goToNextTourElement,
    goToPreviousTourElement
};
