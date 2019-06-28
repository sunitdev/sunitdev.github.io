import * as React from 'react';

import { Coordinates } from '../../../models';


/**
 * Hook to provide current mouse pointer location
 *
 * @param initalCoordinates Initial Mouse pointer locations
 */
function useMousePointerLocation(initialCoordinates: Coordinates): Coordinates {

    // State and Effect hook for mouse location
    const [ mouseLocation, setMouseLocation] = React.useState<Coordinates>(initialCoordinates);

    // Event listener for mouse movement
    React.useEffect(() => {

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }

    }, []);

    // Event handler
    function handleMouseMove(event: MouseEvent) {

        setMouseLocation({
            x: event.clientX,
            y: event.clientY
        });
    }

    // Return current mouse location
    return mouseLocation;
}

export { useMousePointerLocation }