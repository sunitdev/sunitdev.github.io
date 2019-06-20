import * as React from 'react';

import styled from 'styled-components';

import HomeSection from '../Sections/Home/HomeSection';
import ProjectSection from '../Sections/Projects/ProjectSection';

const StyledHomeSection = styled(HomeSection)`
    height: 100vh;
`;

const StyledProjectSection = styled(ProjectSection)`
    height: 100vh;
`;

export default class AppLayout extends React.Component {

    render(){
        return (
            <React.Fragment>
                <StyledHomeSection/>
                <StyledProjectSection/>
            </React.Fragment>
        );
    }

}