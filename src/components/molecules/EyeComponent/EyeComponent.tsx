import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styled from 'styled-components';

import { Coordinates } from '../../../models';

import { EyeScleraComponent } from '../../atoms/EyeScleraComponent';
import { EyeIrisComponent } from '../../atoms/EyeIrisComponent';
import { EyePupilComponent } from '../../atoms/EyePupilComponent';

import { useMousePointerLocation } from './Hooks';

/**
 * Relative Coordinate type with respect to parent
 */
type RelativePosition = {
    top: string | number;
    left: string | number;
}


// Container interface and component
interface ContainerProps {
    width: string;
    height: string;
}

const Container = styled.div<ContainerProps>`
    width: ${(props: any) => props.width};
    height: ${(props: any) => props.height};
    position: relative;
    margin-left: 10px;
    margin-right: 10px;
`;


/**
 * Given an React Component, return its center coordinate
 *
 * @param component Mounted React Component
 */
function getCenterOfComponent(component: React.Component): Coordinates {

    const boundRect = (ReactDOM.findDOMNode(component) as any).getBoundingClientRect();

    return {
        x: boundRect.right - (boundRect.width / 2),
        y: boundRect.top - (boundRect.height / 2)
    }
}

/**
 * Return relative percentage distance (-100% to 100%)  between the point
 *
 * @param coordinate1 Location of coordinate1
 * @param coordinate2 Location of coordinate2
 */
function getRelativePercentageBetweenPoints(coordinate1: Coordinates, coordinate2: Coordinates): Coordinates{

    const sectionWidth: number = coordinate1.x >= coordinate2.x ? coordinate2.x : window.innerWidth - coordinate1.x;
    const sectionHeight: number = coordinate1.y >= coordinate2.y ? coordinate2.y : window.innerHeight - coordinate1.y;

    const horizontalDistance: number = coordinate2.x - coordinate1.x;
    const horizontalPercentage: number = (horizontalDistance / sectionWidth) * 100;

    const verticalDistance: number = coordinate2.y - coordinate1.y;
    const verticalPercentage: number = (verticalDistance / sectionHeight) * 100;

    return {
        x: horizontalPercentage,
        y: verticalPercentage
    }
}

function computePositionOfCompomentRelativeToMousePointer(componentCenter: Coordinates, mouseLocation: Coordinates): RelativePosition {

    // Default position
    if (mouseLocation.x === 0 && mouseLocation.y === 0) {
        return {
            left: '0',
            top: '0'
        }
    }

    const relativePercentage: Coordinates = getRelativePercentageBetweenPoints(componentCenter, mouseLocation);

    relativePercentage.x = relativePercentage.x / 2;
    relativePercentage.x = relativePercentage.x >= 0 ? Math.min(relativePercentage.x, 30) : Math.max(relativePercentage.x, -30);

    relativePercentage.y = relativePercentage.y / 2;
    relativePercentage.y = relativePercentage.y >= 0 ? Math.min(relativePercentage.y, 30) : Math.max(relativePercentage.y, -30);

    return {
        left: `${Math.round(relativePercentage.x)}%`,
        top: `${Math.round(relativePercentage.y)}%`
    }
}

// Eye Component Props
interface EyeComponentProps {
    width?: string;
    height?: string;
}


const EyeComponent: React.SFC<EyeComponentProps> = (props: EyeComponentProps): JSX.Element => {

    // Current Mouse Location
    const mouseLocation: Coordinates = useMousePointerLocation({x: 0, y: 0});

    // Reference of Irish and Pupil
    const [ pupilComponentRef ] = [React.useRef()];

    // On mount get location of iris and pupil component
    const [pupilLocation, setPupilLocation] = React.useState<Coordinates>();
    React.useEffect(() => {
        setPupilLocation(getCenterOfComponent(pupilComponentRef.current));
    }, []);

    // Compute relative position based on mouse pointer
    const pupliPosition = computePositionOfCompomentRelativeToMousePointer(pupilLocation, mouseLocation);

    return (
        <Container
            width={props.width}
            height={props.height}>

            <EyeScleraComponent />

            <EyeIrisComponent
                left={pupliPosition.left}
                top={pupliPosition.top}/>

            <EyePupilComponent
                ref={pupilComponentRef}

                left={pupliPosition.left}
                top={pupliPosition.top}/>

        </Container>
    )
}

// Default Props
EyeComponent.defaultProps = {
    width: '150px',
    height: '150px'
};

export { EyeComponent }
