import * as React from 'react';

import styled from 'styled-components';


const Container = styled.div`
    position: relative;
`;

const Body = styled.div`
    position: absolute;

    top: 0;

    width: 100%;
    height: 100%;

    border-radius: 50%;

    background-color: ${(props: any) => props.theme.colors.backgroundSecondary};

    box-shadow: inset 0 0 5px white, 0 0 5px black;

    z-index: -100;
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

    z-index: -200;
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

    z-index: -200;
`;


interface IDevilCharacterComponentProps {
    className?: string;
}

export default class DevilCharacterComponent extends React.Component<IDevilCharacterComponentProps, any> {

    render(){
        return (
            <Container className={this.props.className}>
                <LeftEar/>
                <RightEar/>
                <Body/>
                {this.props.children}
            </Container>
        );
    }
}