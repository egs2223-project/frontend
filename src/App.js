import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Appointments from './pages/appointments'


export const UserContext = React.createContext();

class UserCtx {
    constructor() {
        this.user = null;
        this.user_role = null;
        this.status = "uninitialized";
    }

    setUser(user) {
        this.user = user;
    }

    setUserRole(role) {
        this.user_role = role;
    }

    setStatus(status) {
        this.status = status;
    }
}

class App extends React.Component {
  constructor(props) {
      super(props);

      this.update = (c) => {
          this.setState(() => ({ c }));
      };

      this.state = { ctx: new UserCtx(), ctx_update: this.update };
  }

  render() {
      return (
          <Router>
              <UserContext.Provider value={this.state}>
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/appointments" element={<Appointments />} />
                  </Routes>
              </UserContext.Provider>
          </Router>
      );
  }
}


export default App;
