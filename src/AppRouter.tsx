import * as React from 'react';

import { Router, Route } from 'react-router-dom';
import { createHashHistory, Location } from 'history';

import * as ReactGA from 'react-ga';

import { HomePage } from './components/pages/HomePage';
import { ProjectPage } from './components/pages/ProjectPage';


function getURlFromLocation(location: Location): string {
    return location.pathname + location.search
}

// Global google analytics init
ReactGA.initialize('UA-89933347-1');

// Create history object
const history = createHashHistory();

// Add listener for google analytics
history.listen((location: Location, action: any) => {
    ReactGA.pageview(getURlFromLocation(location))
})

// Send initial location
// as history.listen only fires when the location changes. On the initial page load, the current location is already in history.location.
ReactGA.pageview(getURlFromLocation(history.location))

const AppRouter = () => (
    <Router history={history}>
        <Route path="/" exact component={HomePage}/>
        <Route path="/projects/" component={ProjectPage}/>
    </Router>
);

export { AppRouter }