import axios from 'axios';

import { Project } from '../../models/Project';

const PROJECT_LIST_ID = '5d0c4e84976b56074e2ff245';

// API Request Params
const URL_PROJECT_LIST = `https://api.trello.com/1/lists/${PROJECT_LIST_ID}/cards`;
const PARAM_PROJECT_LIST = {
    fields: 'name,desc',
    attachments: true,
    attachment_fields: 'name,url'
}

// Attachment Regex
const ATTACHMENT_THUMBNAIL_REGEX = /^thumbnail\.(png|jpe?g)+$/;
const ATTACHMENT_ANIMATED_GIF_REGEX = /^animation.gif$/;
const ATTACHMENT_PROJECT_LINK_REGEX = /^url$/;
const ATTACHMENT_TECHNOLOGIES_REGEX = /^technologies$/;
const ATTACHMENT_DISPLAY_URL_REGEX = /^display-url$/;

/**
 * Return a promise to get project list from trello
 */
async function getProjects(): Promise<Project[]> {

    return axios.get(URL_PROJECT_LIST, { params: PARAM_PROJECT_LIST })
        .then((response: any): Project[] => response.data.map(parseResponseToProject))
}

/**
 * Parse response data to project type object
 * @param data Response data item
 */
function parseResponseToProject(data: any): Project {

    // Get attachments
    let thumbnailURL, animatedGifURL, projectLink, displayURL: string;

    let technologies: string[] = [];

    data.attachments.map((item: any)=> {
        let name: string = item.name.toLowerCase().trim();

        if( ATTACHMENT_ANIMATED_GIF_REGEX.test(name) ){
            animatedGifURL = item.url;
        }else if( ATTACHMENT_THUMBNAIL_REGEX.test(name) ){
            thumbnailURL = item.url;
        }else if( ATTACHMENT_PROJECT_LINK_REGEX.test(name) ){
            projectLink = item.url;
        }
        else if( ATTACHMENT_TECHNOLOGIES_REGEX.test(name) ){
            technologies = item.url.replace('http://', '').split(',').map((item: string) => item.trim());
        }
        else if( ATTACHMENT_DISPLAY_URL_REGEX.test(name) ){
            displayURL = item.url;
        }
    })

    return {
        title: data.name,
        description: data.desc,

        url: projectLink,

        thumbnailURL,
        animatedGifURL,
        displayURL,
        technologies
    }
}


export { getProjects }