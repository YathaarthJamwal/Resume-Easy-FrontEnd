import React ,{Component} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import './App.module.css';
import Home from './containers/Home/Home';
import Form from './containers/Form/Form';
import Success from './containers/Success/Success';
import Failure from './containers/Failure/Failure';

class App extends Component {
  render() {
    let queryParams = [[null,null], [null,null], [null,null]];
    let pathTo = null;
    let i = 0;
    const params = new URLSearchParams(window.location.search)
    for (const param of params) {
        console.log(param);
        queryParams.splice(i,1,param);
        queryParams.push(param);
        i++;
    }
    console.log(queryParams);

    if(localStorage.hasOwnProperty('data') && !queryParams[1][1]) {
      pathTo = <Redirect to="/Form" />
    } else {
      if(queryParams[1][1] === 'Credit') {
        pathTo = <Redirect to="/Success" />;
      } else if (queryParams[1][1] === null) {
        pathTo = <Redirect to="/Home" />;
      } else if (queryParams[1][1]=== 'Failed') {
        pathTo = <Redirect to={{
          pathname: '/Failure',
          state: {requestId: queryParams[2][1]}
        }} />;
      } else {
        pathTo = <Redirect to="/Home"/>;
      }
    }

    return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/Home" component={Home}/>
            <Route exact path="/Success" component={Success}/>
            <Route exact path="/Failure" component={Failure}/>
            <Route exact path="/Form" component={Form}/>
            <Route path="/" component={Home} />
          </Switch>
          {pathTo}
        </BrowserRouter>

    );
  }
}

export default App;
