import * as React from 'react';

import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
`;

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

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        max-height: 150px;
        max-width: 150px;
    }
`;

const StyledLink = styled.a`
    margin-top: 15px;

    color: ${props => props.theme.colors.secondaryTextForeground};

    text-decoration: none;

    font-weight: bold;
`;

interface IconButtonProps {
    className?: string;

    src: string;

    text?: string;

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

    function handelTextClicked(event: React.MouseEvent){
        event.preventDefault();

        if(props.onClick){
            props.onClick(event);
        }
    }

    return (
        <Container>

            <Image
                src={props.src}

                className={props.className}

                data-tip data-for={iconButtonID}

                onClick={handleImageClicked}/>

            {
                props.text &&

                <StyledLink
                    href="#"
                    onClick={handelTextClicked}>{props.text}</StyledLink>
            }

        </Container>
    );
}

export { IconButton }
