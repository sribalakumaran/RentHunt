import React,{useState,useEffect} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Layout from './../components/Layout/Layout';
import {getAuth,updateProfile} from "firebase/auth";
import {toast} from "react-toastify";
import { db } from '../firebase.config';
import {FaEdit} from "react-icons/fa";
import {BsFillPlusCircleFill} from 'react-icons/bs'
import {MdDoneOutline} from 'react-icons/md';
import {doc,updateDoc,collection,getDocs,query,where,orderBy,deleteDoc} from 'firebase/firestore';
import Listing from './Listing';
import ListingItems from '../components/Layout/ListingItems';

const Profile = () => {
    const auth = getAuth()
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [listings,setListings] = useState(null)

    //useEffect
    useEffect(() => {
        const fetchUserListings = async() => {
                const listingRef = collection(db,'listings');
                const q = query(listingRef,where('useRef','==',auth.currentUser.uid),orderBy('timestamp','desc'));
                const querySnap = await getDocs(q)
                console.log(getDocs(q));
                let listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id:doc.id,
                        data:doc.data(),
                    });
                });
                setListings(listings)
                setLoading(false)
                console.log(listings);
        }
        fetchUserListings()
    },[auth.currentUser.uid]);
    const [changeDetails,setChangeDetails] = useState(false)
    const [formData,setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const {name,email} = formData
    const logoutHandler = () =>{
        auth.signOut();
        toast.success("Logged out successfully...");
        navigate("/");
    }

    const onChange = (e) =>{
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,  
        }))
    }

    const onsubmit = async () => {
        try{
            if(auth.currentUser.displayName !==name){
                await updateProfile(auth.currentUser,{
                    displayName:name
                })
                const userRef=doc(db,'users',auth.currentUser.uid);
                await updateDoc(userRef,{name});
                toast.success('User Updated!');
            }

        }catch(error){
            console.log(error);
            toast("Something went wrong...")
        }
    }
    //delete handler
    const onDelete = async (listingId) => {
        if(window.confirm('Are you sure want to delete ?')){
            await deleteDoc(doc(db,'listings',listingId))
            const updatedListings = listings.filter(
                (listing) =>  listing.id !== listingId
            );
            setListings(updatedListings);
            toast.success("Item deleted successfully...")
        }
    }

    //edit handler
    const onEdit = async (listingId) => {
        navigate(`/editlisting/${listingId}`);
    }

  return (
    <Layout>
        <div className="container w-50  d-flex justify-content-between">
        </div>
        <div className="container mt-4 card" style={{width: '18rem'}}>
            <div className='card-header'>
                <div className='d-flex justify-content-between'>
                    <h4 className='text-center'>Profile</h4>
                    <span style={{cursor: 'pointer'}} onClick={() => {
                        changeDetails && onsubmit();
                        setChangeDetails(prevState => !prevState);
                    }}>
                        { changeDetails ? (<MdDoneOutline color='green'/>) : (<FaEdit color='black'/>) }
                    </span>
                </div>
            </div>
            <div className="card-body">
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" value={name} onChange={onChange} disabled={!changeDetails}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={onChange} disabled={!changeDetails} aria-describedby="emailHelp" />
                    </div>
                </form>      
            </div>
            <button className='btn btn-dark' style={{marginLeft:'75px',width:'100px'}} onClick={logoutHandler}>Logout</button>
        </div>   
        <br/>
        <div className='container w-50 mt-4  d-flex justify-content-between'>
                    <Link to="/create-list" style={{textDecoration:'none',color:'black',fontSize:'20px'}}>
                        <span><BsFillPlusCircleFill />&emsp; Add house for Rent or Sell.</span>
                    </Link>
            
        </div>
        <br/><br/><hr/><br/><br/>
        <div className='container'>
            {listings && listings?.length>0 && (
                <>
                <div className='bg-dark text-light p-2'>
                    <h1 className='text-center'>Your Listings</h1>
                </div>
                    <br/>
                    <div>
                        {listings.map((listing) => (
                            <ListingItems 
                                key={listing.id} 
                                listing={listing.data} 
                                id={listing.id} 
                                onDelete={() => onDelete(listing.id)}
                                onEdit =  {() => onEdit(listing.id)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>  
    </Layout>
  )
}

export default Profile;