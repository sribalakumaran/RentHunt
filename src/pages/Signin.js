import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillEyeFill } from "react-icons/bs";
import Layout from "./../components/Layout/Layout";
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify"; 
import OAuth from "../components/OAuth";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const loginHandler = async (e) => {
    e.preventDefault()
    try{
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth,email,password)
      if(userCredential.user){
        toast.success("Login successful...")
        navigate("/")
      }
    }catch(error){
      toast.error("Invalid email or password...")
    }
  };

  return (
    <Layout>
      <br/><br/><br/><br/>
      <div className="d-flex  align-items-center justify-content-center w-100">
        <form className="bg-light p-4" onSubmit={loginHandler}>
          <h4 className="bg-dark p-2 mt-2 text-light text-center">Sign In</h4>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={onChange}
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={onChange}
              className="form-control"
              id="password"
            />
            <span>
              show password
              <BsFillEyeFill
                className="text-dark ms-2"
                style={{ cursor: "pointer",color:'black' }}
                onClick={() => {
                  setShowPassword((prevState) => !prevState);
                }}
              />
            </span><br/><br/>
            <Link to="/forgot-password" style={{float:'right',color:'black'}}>forgot password</Link>
          </div>
          <br/>
          <button type="submit" className="btn btn-dark rounded-5" style={{marginLeft:'50px', width:'100px'}}>
            Sign in
          </button>
          <OAuth/>
          <div className="mt-2">
            <span>Did not have an account </span> <Link to="/signup" style={{color:'black'}}>Sign up</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Signin;