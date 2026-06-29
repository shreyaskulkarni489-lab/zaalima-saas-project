import { useState } from "react";
import API from "../services/api";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
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

      const res = await API.post("/users/register", formData);

      alert(res.data.message);

    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }

  };

  return (

    <div>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br /><br />

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

        <select
          name="role"
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>

        <br /><br />

        <button>Register</button>

      </form>

    </div>

  );

}

export default Register;