import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {AiOutlineFileAdd} from 'react-icons/ai';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/Layout/Spinner';
import { toast } from 'react-toastify';
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage';
import { db } from '../firebase.config';
import {addDoc,collection,serverTimestamp} from 'firebase/firestore'


const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [], // initialize with an empty array
    latitude: 0,
    longitude: 0,
    useRef: null, // add this property
  });

  const {type,name,bedrooms,bathrooms,parking,furnished,address,offer,regularPrice,discountedPrice,images,latitude,longitude} = formData
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted) {
        setFormData((formData) => ({
          ...formData,
           useRef: user?.uid, // use optional chaining to avoid errors
        }));
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
    //eslint-disable-next-line
  }, [auth]);
  if (loading) {
    return <Spinner />;
  }

  //mutate function
  const onChangeHandler = (e) => {
    let boolean = null;
    if(e.target.value === 'true') {
        boolean = true;
    }
    if(e.target.value === 'false'){
        boolean = false;
    }
    //files
    if(e.target.files){
        setFormData((prevState) => ({
            ...prevState,
            images:e.target.files,
        }));
    }
    //text / booleans / number
    if (!e.target.files){
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value,
        }));
    }
  };

  //form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    if(discountedPrice>=regularPrice){
        setLoading(false);
        toast.error('Discount Price should be less than regular price');
        return
    }
    if(images>6)
    {
        setLoading(false);
        toast.error('Maximum of 6 images can be selected');
        return
    }
    // let geoLocation={};
    // let location;
    // if(geoLocationEnable){
    //     const response=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCcdggkOmlBbc0uo93LdD7VCv2npMpUy8Y`)
    //     const data=await response.json();
    //     console.log(data);
    // }else{
    //     geoLocation.lat  = latitude;
    //     geoLocation.lng = longitude;
    //     location = address;
    // }
    
    //store images to firebase
    const storeImage = async(image) => {
        return new Promise((resolve,reject) => {
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storageRef = ref(storage,'images/'+fileName)
            const uploadTask = uploadBytesResumable(storageRef,image)
            uploadTask.on('state_changed',(snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100) 
                console.log('upload is ' + progress+ '% done.');
                switch(snapshot.state){
                    case 'paused' : 
                        console.log('upload is paused');
                        break
                    case 'running' : 
                        console.log('upload is running');
                        break
                    //default : return snapshot.state
                }
            },
            (error) => { reject(error) },
            //success
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                })
            }
            )
        })
    }
    //link gen execues
    const imgUrls = await Promise.all([...images]
    .map(image => storeImage(image))
    )
    //error
    .catch(() => {
        setLoading(false)
        toast.error("Image not uploaded")
        return;
    })
    console.log(imgUrls);

    //save form data
    const formDataCopy={...formData,imgUrls,timestamp:serverTimestamp()}
    formData.location= address
    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discountedPrice
    const docRef= await addDoc(collection(db,'listings'),formDataCopy)
    setLoading(false);
    toast.success('Property Inserted Successfully');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };


  return (
    <Layout>
        <div className='container d-flex flex-column align-items-center justify-content-center'>
           <h3 className='mt-3 w-50 bg-dark text-light p-2 text-center'>
            Create Listing &nbsp;
            <AiOutlineFileAdd />
            </h3>
            {/* sell rent button */}
            <form className='w-50 bg-light p-4' onSubmit={onSubmit}>
                <div className='d-flex flex-row mt-4'>
                    <div className='form-check'>
                        <input 
                            className='form-check-input'
                            type="radio" 
                            value="rent" 
                            onChange={onChangeHandler}
                            defaultChecked
                            name="type"
                            id="type"/>
                        <label className='form-check-label' htmlFor='rent'>Rent</label>
                    </div>
                    <div className='form-check ms-3'>
                        <input 
                            className='form-check-input'
                            type="radio" 
                            name="type" 
                            value="sale"
                            onChange={onChangeHandler}
                            id='type'/>
                        <label className='form-check-label' htmlFor='sale'>Sale</label>                        
                    </div>
                </div>
                {/* name */}
                <div className='mb-3 mt-4'>
                    <label htmlFor='name' className='form-label'>Name</label>
                    <input 
                        className='form-control'
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={onChangeHandler}
                        required/>
                </div>
                {/* bedrooms */}
                <div className='mb-3 mt-4'>
                    <label htmlFor='bedrooms' className='form-label'>Bedrooms</label>
                    <input 
                        className='form-control'
                        type="number" 
                        id="bedrooms" 
                        value={bedrooms}
                        onChange={onChangeHandler}
                        required/>
                </div>
                {/* bathrooms */}
                <div className='mb-3 mt-4'>
                    <label htmlFor='bathrooms' className='form-label'>Bathrooms</label>
                    <input 
                        className='form-control'
                        type="number" 
                        id="bathrooms" 
                        value={bathrooms}
                        onChange={onChangeHandler}
                        required/>
                </div>
                {/* parking */}
                <div className='mb-3 mt-4'>
                    <label htmlFor='parking' className='form-label'>
                        Parking : 
                    </label>
                    <div className='d-flex flex-row mt-4'>
                        <div className='form-check'>
                            <input 
                                className='form-check-input'
                                type="radio" 
                                value={true} 
                                onChange={onChangeHandler}
                                name="parking"
                                id="parking"/>
                            <label className='form-check-label' htmlFor='yes'>Yes</label>
                        </div>
                        <div className='form-check ms-3'>
                            <input 
                                className='form-check-input'
                                type="radio" 
                                name="parking" 
                                value={false}
                                defaultChecked
                                onChange={onChangeHandler}
                                id='parking'/>
                            <label className='form-check-label' htmlFor='no'>No</label>
                        </div>
                    </div>
                </div>
                {/* furnished */}
                <div className='mb-3 mt-4'>
                    <label htmlFor='furnished' className='form-label'>
                        Furnished : 
                    </label>
                    <div className='d-flex flex-row mt-4'>
                        <div className='form-check'>
                            <input 
                                className='form-check-input'
                                type="radio" 
                                value={true} 
                                onChange={onChangeHandler}
                                name="furnished"
                                id="furnished"/>
                            <label className='form-check-label' htmlFor='yes'>Yes</label>
                        </div>
                        <div className='form-check ms-3'>
                            <input 
                                className='form-check-input'
                                type="radio" 
                                name="furnished" 
                                value={false}
                                defaultChecked
                                onChange={onChangeHandler}
                                id='furnished'/>
                            <label className='form-check-label' htmlFor='no'>No</label>
                        </div>
                    </div>
                </div>
                {/* address */}
                <div className='mb-3'>
                    <label htmlFor='location'>Address : </label>
                    <textarea 
                       className='form-control'
                       placeholder='Enter your Address'
                       id="address"
                       value={address}
                       onChange={onChangeHandler}
                       required/>
                </div>
                {/* geolocation */}
                {!geoLocationEnable && (
                    <div className='mb-3'>
                        <div className='d-flex flex-row'>
                            <div className='form-check'>
                                <label className='form-check-label' htmlFor='yes'>Latitude</label>
                                <input 
                                    className='form-control'
                                    type="number" 
                                    name="latitude" 
                                    value={latitude}
                                    id='latitude'
                                    onChange={onChangeHandler}/>
                            </div>
                            <div className='form-check ms-3'>
                                <label className='form-check-label' htmlFor='no'>Longitude</label>
                                <input 
                                    className='form-control'
                                    type="number" 
                                    name="longitude" 
                                    value={longitude}
                                    id='longitude'
                                    onChange={onChangeHandler}/>
                            </div>
                        </div>
                    </div>
                )}
                {/* Offers */}
                <div className='mb-3'>
                    <label htmlFor='offer' className='form-label'>Offer : </label>
                    <div className='d-flex flex-row'>
                        <div className='form-check'>
                            <input 
                                className='form-check-input'
                                type='radio'
                                name="offer" 
                                value={true}
                                onChange={onChangeHandler}
                                id='offer'/>
                            <label className='form-check ms-3' htmlFor='yes'>Yes</label>
                        </div>
                        <div className='form-check ms-3'>
                              <input 
                                className='form-check-input'
                                type="radio" 
                                name="offer" 
                                value={false}
                                id='offer'
                                onChange={onChangeHandler}/>
                            <label className='form-check ms-3' htmlFor='no'>No</label>
                        </div>
                    </div>
                </div>
                {/* regular price */}
                <div className='mb-3 mt-4'>
                    <label htmlFor='name' className='form-label'>Regular Price : </label>
                    <div className='d-flex flex-row'>
                        <input 
                            className='form-control w-50'                        
                            type="number" 
                            name="regularPrice" 
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onChangeHandler}
                            required/>
                        {type === 'rent' ? <p className='ms-4 mt-2'>$ per month.</p> : <p className='ms-4 mt-2'>$ only.</p>}
                    </div>
                </div>
                {/* discountedPrice */}
                {offer && (
                    <div className='mb-3 mt-4'>
                        <label className='form-label' htmlFor='discountedPrice'>Discounted Price : </label>
                        <input 
                            className='form-control w-50'
                            type="number" 
                            name="discountedPrice" 
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onChangeHandler}
                            required/>     
                    </div>
                )}
                {/* files, image etc */}
                <div className='mb-3'>
                    <label htmlFor='formFile' className='form-label'>Select images : </label>
                    <input 
                        className='form-control'
                        type="file" 
                        name="images"
                        id='images'
                        onChange={onChangeHandler}
                        max='6'
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required/>
                </div>
                
                <div className='mb-3'>
                    <input 
                        disabled={!name || !address || !regularPrice || !images}
                        className='btn btn-dark w-100'
                        type="submit"
                        value="Create Listing"/>
                </div>
            </form> 
        </div>
    </Layout>
  );
};

export default CreateListing;