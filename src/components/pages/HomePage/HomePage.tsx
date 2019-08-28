import * as React from 'react';

import styled from 'styled-components';

import * as ReactGA from 'react-ga';

import { HomePageTemplate } from '../../templates/HomePageTemplate';

import { IconButton } from '../../atoms/IconButton';
import { HeadingText } from '../../atoms/HeadingText';
import { FooterText } from '../../atoms/FooterText';
import { EyeBar } from '../../organisms/EyeBar';
import { IconBar } from '../../organisms/IconBar';

const GithubLogo  = require('../../../assets/images/github_logo.jpg');
const ProjectIcon  = require('../../../assets/images/project_icon.png');
const LinkedInLogo = require('../../../assets/images/linked_in_logo.png');

const NameText = styled(HeadingText)`
    text-align: center;

    margin-bottom: 10px;
`;

const BioText = styled.p`
    text-align: center;
    margin-top: 0;

    text-decoration: underline;

    color: ${props => props.theme.colors.secondaryTextForeground};
`;

const HomePage = (props: any) => {

    function handelGithubIconClicked(){

        // Google analytics
        ReactGA.event({
            category: 'User',
            action: 'Github Profile Icon Clicked'
        })

        // Open github profile
        window.open('https://github.com/sunitdeshpande', '_blank');
    }

    function handelProjectIconClicked(){

        // Google analytics
        ReactGA.event({
            category: 'User',
            action: 'Project Icon Clicked'
        })

        // Open project page
        props.history.push('/projects/');
    }

    function handelLinkedInIconClicked() {

        // Google analytics
        ReactGA.event({
            category: 'User',
            action: 'LinkedIn Profile Icon Clicked'
        })

        // Open linkedin profile
        window.open('https://www.linkedin.com/in/sunitdeshpande/', '_blank');
    }

    return (
        <HomePageTemplate
            eyeBar={
                <EyeBar/>
            }

            nameAndBio = {
                <React.Fragment>
                    <NameText>Sunit Deshpande</NameText>
                    <BioText>Data Scientist & Full-Stack Developer, Dublin, Ireland.</BioText>
                </React.Fragment>
            }

            iconBar = {
                <IconBar>
                    <IconButton
                        src={GithubLogo}
                        toolTip={'Github'}
                        onClick={handelGithubIconClicked}/>
                    <IconButton
                        src={ProjectIcon}
                        toolTip={'Projects'}
                        onClick={handelProjectIconClicked}/>
                    <IconButton
                        src={LinkedInLogo}
                        toolTip={'Linked In'}
                        onClick={handelLinkedInIconClicked}/>
                </IconBar>
            }

            footer={
                <FooterText/>
            }
            />
    );

}

export { HomePage }
