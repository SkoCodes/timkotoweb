import './App.css';
import Login from './components/Login';
import Registration from './components/registration/Registration';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import RegistrationSuccess from './components/registration/RegistrationSuccess';
import Player from './components/player/Player';
import OperatorAgents from './components/operator/index';
import ProtectedRoute from './components/common/ProtectedRoute';
import Footer from './components/common/Footer'
import OperatorAgenPoints from './components/operator/AgentPoints'
import RegistrationLink from './components/operator/RegistrationLink'

class App extends React.Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/register/:code" exact component={Registration} />
          <Route path="/registersuccess" exact component={RegistrationSuccess} />
          <ProtectedRoute path="/player" exact component={Player} roles={["Player"]} />
          <ProtectedRoute path="/operator" exact component={OperatorAgents} roles={["Operator"]} />
          <ProtectedRoute path="/operator/registration-link" exact component={RegistrationLink} roles={["Operator"]} />
          <ProtectedRoute path="/operator/agent-points/:id" exact component={OperatorAgenPoints} roles={["Operator"]} />
        </Switch>
      </Router>
      <Footer />
      </div>
    )

  }
}

export default App;
