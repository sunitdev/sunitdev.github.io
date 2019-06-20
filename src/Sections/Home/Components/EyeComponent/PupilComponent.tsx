import styled from 'styled-components';

interface IPupilComponent {
    left?: number | string;
    top?: number | string;
}


const PupliComponent = styled.span.attrs<IPupilComponent>({
    style: (props: IPupilComponent) => ({
        left: props.left,
        top: props.top
    })
})<IPupilComponent>`
    width: 25%;
    height: 25%;

    border-radius: 50%;

    position: absolute;

    background: linear-gradient(45deg, #333, #000);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, .8);

    right: 0;
    bottom: 0;
    margin: auto;
`;

export { PupliComponent }