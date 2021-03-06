import React, { Component, FormData } from "react";
import { isAuthenticated } from "../auth";
import { read, update } from "./apiUser";
import { Redirect } from "react-router-dom";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
    };
  }

  componentDidMount() {
    this.formData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isvalid = () => {
    const { name, email, password } = this.state;
    if (name.length === 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "Email is invalid" });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: "Paswword should be atleast 6 characters long" });
      return false;
    }
    return true;
  };

  handleChange = (field) => (event) => {
    const value = field ==='photo' ? event.target.files[0] : event.target.value ;
    this.userData.set(field,value)
    this.setState({ [field]: value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    if (this.isvalid()) {
      const { name, email, password } = this.state;
      const user = {
        name,
        email,
        password: password || undefined,
      };
      // console.log(user);
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            redirectToProfile: true,
          });
      });
    }
  };

  editProfileForm = (name, email, password) => (
    <form>
    <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
        });
      }
    });
  };

  render() {
    const { id, name, email, password, redirectToProfile, error } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        {this.editProfileForm(name, email, password)}
      </div>
    );
  }
}

export default EditProfile;
