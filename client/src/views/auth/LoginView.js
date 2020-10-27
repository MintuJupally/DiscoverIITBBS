import React, { Component } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';


import GoogleLogin from 'react-google-login';
import axios from 'axios';
import Logout from './Logout';
// import Profile from '../../../../portal/src/components/Profile.js/index.js';

// import './Layout.css';

class LoginView extends Component {
  state = {
    isLoggedIn: false,
    user: [],
    email: '',
    image: '',
    name: '',
    role: '',
  };

  // constructor(props) {
  //   super(props);
  // }

  successResponseGoogle = (response) => {
    const emailUsed = response.profileObj.email;
    const index = emailUsed.indexOf('@');
    const domain = emailUsed.substr(index);
    console.log(response);
    this.setState({
      user: response.profileObj.name,
      email: response.profileObj.email,
    });

    if (domain !== '@iitbbs.ac.in') {
      alert('Use your iit bbs email id');
    } else {
      // console.log(response.tokenId);
      this.setState({ isLoggedIn: true });
      // this.props.callFunc();

      axios
        .post(
          '/v1/auth/login',
          { tokenId: response.tokenId },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log('login');
          console.log(response.data);
          this.setState({ image: response.data.user.image });
        })
        .catch((err) => console.log(err));
    }
  };

  logout = () => {
    this.setState({ isLoggedIn: false });
    axios
      .post('/v1/auth/logout', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    // this.props.callFunc();
  };

  failureResponseGoogle = (response) => {
    console.log(response);
    alert('Use your IIT BBS email for login');
  };

  render = () => {
    // console.log(`${__dirname}../../.env`);
    // console.log(process.env);

    if (!this.state.isLoggedIn) {
      return (
        <div className="Login">
          <GoogleLogin
            clientId="1092979243632-ufl3842hjal4adoaio73ta2noj2avnbo.apps.googleusercontent.com"
            buttonText="Login with google"
            isSignedIn={true}
            onSuccess={this.successResponseGoogle}
            onFailure={this.failureResponseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      );
    } else
      return (
        <div className="page">
          {/* <Button variant ="contained">
            Portal
          </Button>
          <Logout img={this.state.image} onLogout={this.logout} />
          <Profile
            user={this.state.user}
            email={this.state.email}
            role={this.state.role}
          /> */}
          <h1>Logged in</h1>
          <Logout img={this.state.image} onLogout={this.logout} />
        </div>
      );
  };
}

export default LoginView;
