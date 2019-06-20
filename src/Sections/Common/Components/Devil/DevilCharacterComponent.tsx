import * as React from 'react';

import styled from 'styled-components';


const Container = styled.div`
    position: relative;

    width: 100%;
    height: 200%;
`;

const Body = styled.div`
    position: absolute;

    top: 0;

    width: 100%;
    height: 100%;

    border-radius: 50%;

    background-color: ${(props: any) => props.theme.colors.backgroundSecondary};

    box-shadow: inset 0 0 5px white, 0 0 5px black;
`;

const LeftEar = styled.div`
    position: absolute;

    top: 0;

    left: 15%;

    width: 10%;
    height: 20%;

    border-radius: 50%;

    background-color: ${(props: any) => props.theme.colors.backgroundSecondary};

    box-shadow: inset 0 0 5px white, 0 0 5px black;
`;

const RightEar = styled.div`
    position: absolute;

    top: 0;

    left: 75%;

    width: 10%;
    height: 20%;

    border-radius: 50%;

    background-color: ${(props: any) => props.theme.colors.backgroundSecondary};

    box-shadow: inset 0 0 5px white, 0 0 5px black;
`;


export default class DevilCharacterComponent extends React.Component {

    render(){
        return (
            <Container>
                <LeftEar/>
                <RightEar/>
                <Body/>
            </Container>
        );
    }
}