import * as React from 'react';

import styled from 'styled-components';

import * as ReactGA from 'react-ga';

import {HomePageTemplate} from '../../templates/HomePageTemplate';

import {IconButton} from '../../atoms/IconButton';
import {HeadingText} from '../../atoms/HeadingText';
import {FooterText} from '../../atoms/FooterText';
import {EyeBar} from '../../organisms/EyeBar';
import {IconBar} from '../../organisms/IconBar';

const GithubLogo = require('../../../assets/images/github_logo.jpg');
const ProjectIcon = require('../../../assets/images/project_icon.png');
const LinkedInLogo = require('../../../assets/images/linked_in_logo.png');
const ResumeLogo = require('../../../assets/images/cv-icon.png');

const NameText = styled(HeadingText)`
  text-align: center;

  margin-bottom: 10px;
`;

const BioText = styled.p`
  text-align: center;
  margin-top: 0;

  color: ${props => props.theme.colors.secondaryTextForeground};

  /* Smartphones (portrait and landscape) ----------- */
  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
    font-size: 2em;
  }
`;

const HomePage = (props: any) => {

  function handelGithubIconClicked() {

    // Google analytics
    ReactGA.event({
      category: 'User',
      action: 'Github Profile Icon Clicked'
    })

    // Open github profile
    window.open('https://github.com/sunitdev', '_blank');
  }

  function handelProjectIconClicked() {

    // Google analytics
    ReactGA.event({
      category: 'User',
      action: 'Project Icon Clicked'
    })

    // Open project page
    props.history.push('/projects/');
  }

  function handelOpenSourceIconClicked() {

    // Google analytics
    ReactGA.event({
      category: 'User',
      action: 'Open Source Icon Clicked'
    })

    // Open project page
    props.history.push('/open-source/');
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

  function handleResumeIconClicked() {
    // Google analytics
    ReactGA.event({
      category: 'User',
      action: 'Resume Icon Clicked'
    })

    // Open linkedin profile
    window.open('https://sunitdev.github.io/resume/', '_blank');
  }

  return (
    <HomePageTemplate
      eyeBar={
        <EyeBar/>
      }

      nameAndBio={
        <React.Fragment>
          <NameText>Sunit Deshpande</NameText>
          <BioText>Full-Stack Developer @Amazon</BioText>
        </React.Fragment>
      }

      iconBar={
        <IconBar>
          <IconButton
            src={GithubLogo}
            text={'Github'}
            onClick={handelGithubIconClicked}/>
          <IconButton
            src={ProjectIcon}
            text={'Projects'}
            onClick={handelProjectIconClicked}/>
          <IconButton
            src={LinkedInLogo}
            text={'LinkedIn'}
            onClick={handelLinkedInIconClicked}/>
          <IconButton
            src={ResumeLogo}
            text={'Resume'}
            onClick={handleResumeIconClicked}/>
        </IconBar>
      }

      footer={
        <FooterText/>
      }
    />
  );

}

export {HomePage}
