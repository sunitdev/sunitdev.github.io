import axios from 'axios';

import Project from './models/Project';

export default class TrelloApi {

    private static readonly PROJECT_LIST_ID = '5d0c4e84976b56074e2ff245';


    public static getProjects(): Promise<Project[]>{

        const url: string = `https://api.trello.com/1/lists/${TrelloApi.PROJECT_LIST_ID}/cards`;

        const params: any = {
            fields: 'name,desc',
            attachments: true,
            attachment_fields: 'name,url'
        };

        return axios.get(url, { params })
            .then((response: any) : Project[] => response.data.map(TrelloApi.parseProjectData))
    }

    private static parseProjectData(data: any): Project {

        const THUMBNAIL_REGEX = /thumbnail\.(png|jpe?g)+/;
        const ANIMATED_GIF_REGEX = /animation.gif/;

        let thumbnail, animatedGif: string;
        data.attachments.map((item: any)=> {
            let name: string = item.name.toLowerCase().trim();

            if( ANIMATED_GIF_REGEX.test(name) ){
                animatedGif = item.url;
            }else if( THUMBNAIL_REGEX.test(name) ){
                thumbnail = item.url;
            }
        })

        return {
            title: data.name,
            description: data.desc,

            thumbnail,
            animatedGif
        }
    }
}