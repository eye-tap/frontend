import {
    assignedFixationColor,
    assignedLineColor,
    boundingBoxColor,
    cursorLineColor,
    highlightedBoundingBoxColor,
    hoveredFixationColor,
    machineAssignedFixationColor,
    proximityBoundingBoxColor,
    selectedFixationColor,
    unassignedFixationColor
} from '../config';

export const reloadThemeColours = () => {
    setTimeout( () => {
        const r = document.querySelector( ':root' )!;
        const rs = getComputedStyle( r );

        assignedLineColor.value = rs.getPropertyValue( '--theme-information-shade' );
        cursorLineColor.value = rs.getPropertyValue( '--theme-bg-4' );
        boundingBoxColor.value = rs.getPropertyValue( '--theme-bg-3' );
        highlightedBoundingBoxColor.value = rs.getPropertyValue( '--theme-bg-4' );
        proximityBoundingBoxColor.value = rs.getPropertyValue( '--theme-bg-3-20' );
        selectedFixationColor.value = rs.getPropertyValue( '--theme-bg-4' );
        assignedFixationColor.value = rs.getPropertyValue( '--theme-success' );
        unassignedFixationColor.value = rs.getPropertyValue( '--theme-warning' );
        hoveredFixationColor.value = rs.getPropertyValue( '--theme-bg-4-shade' );
        machineAssignedFixationColor.value = rs.getPropertyValue( '--theme-information' );
    }, 200 );
};
