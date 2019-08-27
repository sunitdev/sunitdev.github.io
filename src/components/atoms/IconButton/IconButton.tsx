import * as React from 'react';

import styled from 'styled-components';

import * as ReactTooltip from 'react-tooltip';

const Image = styled.img`
    max-height: 90px;
    max-width: 90px;

    cursor: pointer;

    padding: 5px;

    box-shadow: 0 3px 4px 3px rgba(44, 71, 146, 0.25);
    border-radius: 100%;

    :hover {
        transform: scale(1.2);
    }

`;

interface IconButtonProps {
    className?: string;

    src: string;

    toolTip?: string;
    onClick?: (event: React.MouseEvent) => void;
}

// Unique id for each tooltip
let nextIconButtonId = -1;

const IconButton: React.SFC<IconButtonProps> = (props: IconButtonProps) => {

    // Increment ID for each component
    const iconButtonID = `IconButton_${++nextIconButtonId}`;

    /**
     * Call props onCLick if present
     * @param event React click event
     */
    function handleImageClicked(event: React.MouseEvent) {
        if(props.onClick){
            props.onClick(event);
        }
    }

    return (
        <React.Fragment>

            <Image
                src={props.src}

                className={props.className}

                data-tip data-for={iconButtonID}

                onClick={handleImageClicked}/>

            {
                props.toolTip &&

                <ReactTooltip
                    id={iconButtonID}
                    effect='solid'
                    place='bottom'>

                    <span>{props.toolTip}</span>

                </ReactTooltip>
            }

        </React.Fragment>
    );
}

export { IconButton }
