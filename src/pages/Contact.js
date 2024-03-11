import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useParams,useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Contact = () => {
  const [message,setMessage]=useState('')
  const [landlord,setLandlord]=useState('')
  const [searchParams,setSearchParams]=useSearchParams()
  const params=useParams()

  useEffect(() => {
    const getLandlord = async () => {
      try {
        const docRef = doc(db, 'users', params.landlordId);
        console.log(params.landlordId)
        console.log(docRef);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
        if (docSnap.exists()) {
          setLandlord(docSnap.data());
        } else {
          toast.error('Unable to fetch landlord data');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching landlord data');
      }
    };
    getLandlord();
  }, [params.landlordId]);

  return (
    <Layout>
      <div className='container mt-4'>
        <h1>Contact Page</h1>
        <div>
        {landlord !== '' && (
          <main>
            <h2>Name : {landlord?.name}</h2>
              <div class="form-floating">
                <textarea class="form-control" placeholder="Leave your message here" id="floatingTextarea" onChange={(e) => {setMessage(e.target.value)}}></textarea>
                <label for="floatingTextarea">Send your message</label>
              </div>
              <a href={`mailto:${landlord.email} ? subject=${searchParams.get('listingName')}&body=${message}`}>
                <button className='btn btn-primary mt-4'>Send</button>
              </a>
          </main>
        )}
          </div>
      </div>
    </Layout>
  );
};

export default Contact;