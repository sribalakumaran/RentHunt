import React,{useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Layout from '../components/Layout/Layout';
import  {BsFillEyeFill} from "react-icons/bs";
import {getAuth,createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import {db} from "../firebase.config";
import {doc,setDoc,serverTimestamp} from 'firebase/firestore';
import OAuth from '../components/OAuth';
const Signup = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData] = useState({
      email:"",
      name:"",
      password:"",
    });
  const {name,email,password} = formData 
  const navigate = useNavigate()
  const onChange=(e)=>{
    setFormData(prevState=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
  }  

  const onsubmitHandler  = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      updateProfile(auth.currentUser, { displayName: name });
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db,'users',user.uid),formDataCopy);
      navigate("/")
      alert("Signup Success");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <br/><br/><br/><br/>
      <div className='d-flex  align-items-center justify-content-center' style={{width:'1500px'}}>
      <form className='bg-light p-2' onSubmit={onsubmitHandler} style={{width:'325px'}}>
        <h4 className='bg-dark p-2 mt-2 text-center text-light'>SIGN UP</h4>
        <div class="mb-3">
          <br/>
          <input type="text" value={name} class="form-control" id="name" onChange={onChange}  placeholder='Enter your name'/>
        </div>
        <div class="mb-3">
          <input type="email" value={email} class="form-control" id="email" onChange={onChange}  aria-describedby="emailHelp" placeholder='Enter your email'/>
        </div>
        <div class="mb-3">
          <input type={showPassword ? 'text':'password'} value={password} id="password" onChange={onChange}  class="form-control"  placeholder='Enter your password'/>
          <p>show password<span><BsFillEyeFill classname='bg-danger ms-2' style={{cursor:'pointer'}}  onClick={()=>{setShowPassword(prevState=>!prevState)}}/></span></p>
        </div>
        <br/>
        <button type="submit" class="btn btn-dark rounded-5" style={{marginLeft:'100px', width:'100px'}}>Sign Up</button>
        <div> 
          <OAuth/>
          <span>Already user exists</span><Link to="/signin" style={{color:'black'}}> login</Link>
        </div>
      </form>        
      </div>
    </Layout>
  )
}

export default Signup;