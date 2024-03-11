import React,{useState} from 'react';
import Layout from '../components/Layout/Layout'
import {Link,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";

const ForgotPassword = () => {
  const [email,setEmail]  = useState('')
  const navigate = useNavigate()

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    try{
      const auth=getAuth();
      await sendPasswordResetEmail(auth,email);
      toast.success("Email was sent");
      navigate('/signin');
    }catch(error){
      toast.error("Something went wrong");
    }
  }


  return (
    <Layout>
        <div className='container mt-4'>
        <h1>Reset your Password</h1>
        <form className='container' onSubmit={onSubmitHandler}>
            <div className="mb-3 container">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className='d-flex justify-content-between'>
              <Link to="/signin">Sign-in</Link>
              <button type="submit" className="btn btn-primary">Reset</button>  
            </div>
            
        </form>
</div>

    </Layout>
  )
}

export default ForgotPassword