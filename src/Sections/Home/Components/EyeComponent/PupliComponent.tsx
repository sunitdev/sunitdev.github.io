import * as React from 'react';

import styled from 'styled-components';

interface IPupliComponent {
    className?: string;
}

const Circle = styled.span`
    border-radius: 50%;

    background: linear-gradient(45deg, #333, #000);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, .8);
`;


export default class PupliComponent extends React.Component<IPupliComponent, any> {

    render(){
        return(
            <Circle
                className={this.props.className}/>
        );
    }

}