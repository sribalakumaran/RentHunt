import React,{useEffect,useState} from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore';
import Spinner from '../components/Layout/Spinner';
import ListingItems from '../components/Layout/ListingItems';


const Category = () => {
    const [listing,setListing] = useState("")
    const [loading,setLoading] = useState(true)
    const params = useParams();
    const [lastFetchListing,setLastFetchListing] = useState(null);

    //fetch listening
    useEffect(() => {
        const fetchListing = async () => {
            try{
                //reference
                const listingsRef = collection(db,'listings');
                //query
                const q = query(
                    listingsRef,
                    where('type','==',params.categoryName),
                    orderBy('timestamp','desc'),
                    limit(10)
                )
                //execute
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchListing(lastVisible);
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
    },[params.categoryName]);


    //load more pagination function
    useEffect(() => {
        const fetchLoadMoreListing = async () => {
            try{
                //reference
                const listingsRef = collection(db,'listings');
                //query
                const q = query(
                    listingsRef,
                    where('type','==',params.categoryName),
                    orderBy('timestamp','desc'),
                    startAfter(lastFetchListing),
                    limit(1)
                )
                //execute
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchListing(lastVisible);
                const listings = [];
                querySnap.forEach(doc => {
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                });
                setListing(prevState => [...prevState, ...listings])
                setLoading(false)
            }catch(error){
                console.log(error);
                toast.error("Unable to fetch data")
            }
        }; 
    },[]);

  return(
  <Layout>
    <div className='container-fluid text-center'>
        <br/><br/>
        <h1>{params.categoryName === 'rent' ? 
            'Places for Rent' : 'Place for Sale'}
        </h1><br/>
        {
            loading?<Spinner/>:listing && listing.length>0?(<>
            <div>
                {listing.map(list => (
                    <ListingItems listing={list.data} id={list.id} key={list.id}/>
                ))}
            </div>
            </>):
            (<p>No Listing for {params.categoryName}</p>)
        }
    </div>
  </Layout>)
};

export default Category;