import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Search from './pages/Search';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import VisitList from './pages/VisitList';

function App() {
  return (
    <Router>
    <div className="app">
      <Navbar/>
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
        <Route path='/'>
          <Landing />
        </Route>
      </Switch>
      <Footer />
    </div>
    </Router>
  );
}


export default App;
