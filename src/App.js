import './App.scss';
import Register from "./pages/Register";
import {
  Switch,
  Route,
} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import RouteNotFound from './utils/RouteNotFound';

function App() {
  return (
      <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register}/>
          <Route exact path="*" component={RouteNotFound} />
      </Switch>
  );
}

export default App;
