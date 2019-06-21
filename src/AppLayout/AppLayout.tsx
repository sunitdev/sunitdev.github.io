import * as React from 'react';

import styled from 'styled-components';

import DevilCharacterComponent from '../Sections/Common/Components/Devil/DevilCharacterComponent';
import HomeSection from '../Sections/Home/HomeSection';
import ProjectSection from '../Sections/Projects/ProjectSection';

const StyledDevilCharacter = styled(DevilCharacterComponent)`
    width: 80%;
    height: 200vh;

    margin: auto;
    margin-top: 20px;
`;

const StyledHomeSection = styled(HomeSection)`
    height: 100vh;
`;

const StyledProjectSection = styled(ProjectSection)`
    height: 100vh;
`;

export default class AppLayout extends React.Component {

    render(){
        return (
        <StyledDevilCharacter>
            <StyledHomeSection/>
            <StyledProjectSection/>
        </StyledDevilCharacter>

);
    }

}