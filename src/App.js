import './App.css';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword'
import Registration from './components/registration/Registration';
import Activation from './components/registration/Activation';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import RegistrationSuccess from './components/registration/RegistrationSuccess';
import Player from './components/player/Player';
import OperatorAgents from './components/operator/index';
import ProtectedRoute from './components/common/ProtectedRoute';
import AgentPlayers from './components/agent/AgentPlayers';
import AgentPlayerPoints from './components/agent/AgentPlayerPoints';
import Footer from './components/common/Footer'
import OperatorAgentPoints from './components/operator/AgentPoints'
import RegistrationLink from './components/common/RegistrationLink'
import AgentContestPlayers from './components/agent/AgentContestPlayers';
import ContestsPage from './components/operator/OperatorContest';
import CreateTeam from './components/player/CreateTeam';
import UpdateTeam from './components/player/UpdateTeam';
import PlayerContest from './components/player/PlayerContest';
import PlayerTeamHistory from './components/player/PlayerTeamHistory';
import PlayerTeamStats from './components/player/PlayerTeamStats';
import PlayerContestResult from './components/player/PlayerContestResult';
import PlayerTransactionHistory from './components/player/PlayerTransactionHistory';
import AgentPlayerTransactionHistory from './components/agent/AgentPlayerTransactionHistory';
import PlayerRules from './components/player/PlayerRules';
import Profile from './components/common/Profile';
import OperatorLiveScore  from './components/operator/OperatorLiveScore';
import OperatorAgentPlayers from './components/operator/OperatorAgentPlayers';
import AgentPlayersView from './components/operator/AgentPlayersView';
import AgentLiveScore from './components/agent/AgentLiveScore';
import OperatorPlayerEntries from './components/operator/OperatorPlayerEntries';
import OperatorPlayerTransactionView from './components/operator/OperatorPlayerTransactionView';
import OperatorContestResult from './components/operator/OperatorContestResult';
import AgentContestResult from './components/agent/AgentContestResult';

class App extends React.Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/reset-password" exact component={ResetPassword} />
          <Route path="/register/:code" exact component={Registration} />
          <Route path="/registersuccess" exact component={RegistrationSuccess} />
          <Route path="/activation" exact component={Activation} />

          <ProtectedRoute path="/agent" exact component={AgentPlayers} roles={["Agent"]} />
          <ProtectedRoute path="/agent/players" exact component={AgentPlayers} roles={["Agent"]} />
          <ProtectedRoute path="/agent/player-points/:id" exact component={AgentPlayerPoints} roles={["Agent"]} />
          <ProtectedRoute path="/agent/contest/players" exact component={AgentContestPlayers} roles={["Agent"]}/>
          <ProtectedRoute path="/agent/transaction/history" exact component={AgentPlayerTransactionHistory} roles={["Agent"]}/>
          <ProtectedRoute path="/agent/agent-live-score" exact component={AgentLiveScore} roles={["Agent"]}/>
          <ProtectedRoute path="/agent/contest/result" exact component={AgentContestResult} roles={["Agent"]}/>
          <ProtectedRoute path="/player" exact component={Player} roles={["Player"]}/>
          <ProtectedRoute path="/player/rules" exact component={PlayerRules} roles={["Player"]}/>
          <ProtectedRoute path="/player/create-team" exact component={CreateTeam} roles={["Player"]} />
          <ProtectedRoute path="/player/update-team" exact component={UpdateTeam} roles={["Player"]} />
          <ProtectedRoute path="/player/contest" exact component={PlayerContest} roles={["Player"]}/>
          <ProtectedRoute path="/player/team/history" exact component={PlayerTeamHistory} roles={["Player"]}/>
          <ProtectedRoute path="/player/team/stats" exact component={PlayerTeamStats} roles={["Player"]}/>
          <ProtectedRoute path="/player/contest/result" exact component={PlayerContestResult} roles={["Player"]}/>
          <ProtectedRoute path="/player/transaction/history" exact component={PlayerTransactionHistory} roles={["Player"]}/>
          <ProtectedRoute path="/operator" exact component={OperatorAgents} roles={["Operator"]} />
          <ProtectedRoute path="/operator/contests" exact component={ContestsPage} roles={["Operator"]} />
          <ProtectedRoute path="/operator/operator-live-score" exact component={OperatorLiveScore} roles={["Operator"]}/>
          <ProtectedRoute path="/operator/operator-agent-players" exact component={OperatorAgentPlayers} roles={["Operator"]}/>
          <ProtectedRoute path="/operator/agent-players-view" exact component={AgentPlayersView} roles={["Operator"]}/>
          <ProtectedRoute path="/operator/player-entries" exact component={OperatorPlayerEntries} roles={["Operator"]}/>
          <ProtectedRoute path="/common/registration-link" exact component={RegistrationLink} roles={["Operator", "Agent"]} />
          <ProtectedRoute path="/operator/agent-points/:id" exact component={OperatorAgentPoints} roles={["Operator"]} />
          <ProtectedRoute path="/operator/player-transaction-view" exact component={OperatorPlayerTransactionView} roles={["Operator"]} />
          <ProtectedRoute path="/operator/contest/result" exact component={OperatorContestResult} roles={["Operator"]}/>

          <ProtectedRoute path="/common/profile" exact component={Profile} roles={["Agent","Player","Operator"]}/>
          
        </Switch>
      </Router>
      <Footer />
      </div>
    )

  }
}

export default App;
