import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser , fetchOtp, submitOtp} from "../../actions/authActions";
import classnames from "classnames";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

//Login component
class Login extends Component {
  constructor() {
    super();
    //initalizing state
    this.state = {
      email: "",
      password: "",
      errors: {},
      disabled: true
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    M.Tabs.init(this.Tabs);
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) { //if any errors occur,set the errors
      this.setState({
        errors: nextProps.errors
      });
    }
    if (!nextProps.disabled.disabled) { //set the disabled value
      this.setState({
        disabled:nextProps.disabled.disabled
      });
    }
  }

//onChange of state
onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

//To login using email and password
onSubmit = e => {
    e.preventDefault();
      const userData = {
      email: this.state.email,
      password: this.state.password
    };
this.props.loginUser(userData); 
  };

//To Generate Otp 
onFetchOtp = e => {
    e.preventDefault();
      const userData = {
      mobile: this.state.mobile
    };
this.props.fetchOtp(userData); 
  };

//To login using mobile and OTP
onSubmitMobile = e => {
    e.preventDefault();
      const userData = {
      mobile: this.state.mobile,
      otp: this.state.otp
    };
this.props.submitOtp(userData); 
  };


render() {
    const { errors} = this.state;
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <div className="row">
    <div className="col s12">
      <ul ref={Tabs => {
            this.Tabs = Tabs;
          }} className="tabs">
        <li className="tab col s6"><a class="active" href="#loginUserName">UserName</a></li>
        <li className="tab col s6"><a  href="#loginMobile">Mobile</a></li>
      </ul>
    </div>
<div id="loginUserName" className="col s12">
	<form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
    </div>
    <div id="loginMobile" className="col s12">
    <form noValidate onSubmit={this.onSubmitMobile}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.mobile}
                  error={errors.mobile}
                  id="mobile"
                  type="text"
                  className={classnames("", {
                    invalid: errors.mobile || errors.mobilenotfound
                  })}
                />
                <label htmlFor="email">Mobile (include +91)</label>
                <span className="red-text">
                  {errors.mobile}
                  {errors.mobilenotfound}
                </span>
              </div>
              <div className="input-field col s12" >
                <input
                  onChange={this.onChange}
                  value={this.state.otp}
                  error={errors.otp}
                  id="otp"
                  type="text"
                  className={classnames("", {
                    invalid: errors.otp || errors.otpincorrect
                  })}
                  disabled= {this.state.disabled}
                />
                <label htmlFor="password">Otp</label>
                <span className="red-text">
                  {errors.otp}
                  {errors.otpincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="button"
                  onClick={this.onFetchOtp}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                 Fetch Otp
                </button>
              </div>
              <br/><br/>
              <div className="col s6" style={{ paddingRight: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                  disabled = {this.state.disabled}
                >
                 Submit Otp
                </button>
              </div>
            </form>
    </div>      
   </div>
</div>
          </div>
        </div>
    );
  }
}

//set Property types for Login 
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  fetchOtp: PropTypes.func.isRequired,
  submitOtp: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.object.isRequired
};

//map State to properties of Login
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  disabled: state.disabled
});
export default connect(
  mapStateToProps,
  {loginUser,fetchOtp,submitOtp}
)(Login);