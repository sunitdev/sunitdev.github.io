import * as React from 'react';

import styled from 'styled-components';


interface IScleraComponent {
    className?: string;
}

const Circle = styled.span`
    border-radius: 50%;

    background: white;

    box-shadow: inset 0 0 50px rgba(10, 10, 100, .4), inset 0 0 20px rgba(10, 10, 100, .4), 0 0 40px rgba(0, 0, 0, .8);
`;


export default class ScleraComponent extends React.Component<IScleraComponent, any> {

    render(){
        return(
            <Circle
                className={this.props.className}/>
        );
    }

}