import { useState } from "react";
import API from "../services/api";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/users/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      console.log(res.data);

    } catch (err) {

      alert(err.response?.data?.message || "Login Failed");

    }

  };

  return (

    <div>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <button>Login</button>

      </form>

    </div>

  );

}

export default Login;