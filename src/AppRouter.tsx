import * as React from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';

import { HomePage } from './components/pages/HomePage';
import { ProjectPage } from './components/pages/ProjectPage';

const AppRouter = () => (
    <Router>
        <Route path="/" exact component={HomePage}/>
        <Route path="/projects/" component={ProjectPage}/>
    </Router>
);

export { AppRouter }