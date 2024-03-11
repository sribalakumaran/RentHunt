import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import { getAuth,signInWithPopup,GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase.config';
import { doc,setDoc,getDoc,serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import {GrGoogle} from 'react-icons/gr'

const OAuth = () => {
   const navigate=useNavigate();
   const location=useLocation();
   const ongoolehandler=async()=>{
        try {
            const auth=getAuth();
            const provider=new GoogleAuthProvider();
            const result=await signInWithPopup(auth,provider);
            const user=result.user;
            const docRef =doc(db,'users',user.uid);
            const docSnap =await getDoc(docRef);
            if(!docSnap.exists()){
                await setDoc(doc(db,'users',user.uid),{
                    name:user.displayName,
                    email:user.email,
                    timestamp:serverTimestamp(),
                })
            }
            navigate("/");
            toast.success('Login Successfully');
        } catch (error) {
            toast.error('Problem with Google Auth')
        }
   };
    return (
    <div>
        <br/>
        <p className='mt-2'>Sign {location.pathname==='/singup' ? 'up':'in'} with &nbsp;
        <button onClick={ongoolehandler}>
            <GrGoogle className='rounded-5' style={{border:'none', margin:'none'}}/>
        </button>
        </p>
    </div>
  )
}

export default OAuth