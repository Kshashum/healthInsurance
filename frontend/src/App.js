import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Claims from "./pages/Claims";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/Unauthorized";
import VisitList from "./pages/VisitList";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Switch>
          <Route path="/s">
            <Search />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/visitlist">
            <VisitList />
          </Route>
          <Route path="/unauthorized">
            <Unauthorized />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/claims">
            <Claims />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
