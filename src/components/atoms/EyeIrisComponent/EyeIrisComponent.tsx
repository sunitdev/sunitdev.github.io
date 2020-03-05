import styled from 'styled-components';

interface EyeIrisComponentProps {
    left?: number | string;
    top?: number | string;

    style?: any;
}

const EyeIrisComponent = styled.span.attrs<EyeIrisComponentProps>({
    style: (props: EyeIrisComponentProps) => ({
        left: props.left,
        top: props.top
    })
})<EyeIrisComponentProps>`
    width: 50%;
    height: 50%;

    border-radius: 50%;

    background: #51b2d5;
    box-shadow: inset 0 0 18px rgba(0, 0, 0, .5), inset 0 0 30px #1b4e6d;

    position: absolute;
    right: 0;
    bottom: 0;
    margin: auto;
`;

export {EyeIrisComponent}