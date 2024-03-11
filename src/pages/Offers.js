import React,{useEffect,useState} from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore';
import Spinner from '../components/Layout/Spinner';
import ListingItems from '../components/Layout/ListingItems';
import { ref } from 'firebase/storage';


const Offers = () => {
  const [listing,setListing] = useState("")
    const [loading,setLoading] = useState(true)
    const params = useParams();

    //fetch listening
    useEffect(() => {
        const fetchListing = async () => {
            try{
                //reference
                const listingsRef = collection(db,'listings');
                //query
                const q = query(
                    listingsRef,
                    where('offer','==',true),
                    orderBy('timestamp','desc'),
                    limit(10)
                )
                //execute
                const querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach(doc => {
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                });
                setListing(listings)
                setLoading(false)
            }catch(error){
                console.log(error);
                toast.error("Unable to fetch data")
            }
        };
        //fn execute
        fetchListing();
    },[]);

  return (
    <Layout>
    <div className='container-fluid'>
        <br/><br/>
        <h1 className='text-center'>Searching Best Offers</h1><br/>
        {loading?<Spinner/>:listing && listing.length>0?(<>
            <div>
                {listing.map(list => (
                    <ListingItems listing={list.data} id={list.id} key={list.id}/>
                ))}
            </div>
            </>):
            (<p>Currenlty, There are no offers available.</p>)
        }
    </div>
  </Layout>
  );
};

export default Offers