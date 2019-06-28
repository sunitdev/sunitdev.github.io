import styled from 'styled-components';

interface EyePupilComponentProps {
    left?: number | string;
    top?: number | string;
}


const EyePupilComponent = styled.span.attrs<EyePupilComponentProps>({
    style: (props: EyePupilComponentProps) => ({
        left: props.left,
        top: props.top
    })
})<EyePupilComponentProps>`
    width: 25%;
    height: 25%;

    border-radius: 50%;

    background: linear-gradient(45deg, #333, #000);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, .8);


    position: absolute;
    right: 0;
    bottom: 0;
    margin: auto;
`;

export { EyePupilComponent }
