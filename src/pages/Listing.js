import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Spinner from '../components/Layout/Spinner'; //'../component/Spinner';
import SwipeCore,{EffectCoverflow,Navigation,Pagination } from 'swiper';
import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.css';
import {FaBed} from 'react-icons/fa'

//config
SwipeCore.use([EffectCoverflow,Pagination])


const Listing = () => {
  const [listing, setListing] = useState(""); //null true
  const [loading, setLoading] = useState(false); // set to true initially
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if(loading){
    return <Spinner />
  }
  return (
    <Layout>
      <br/><br/><br/>
      <div className='container d-flex align-items-center justify-content-center'>
        <div className='card' style={{ width: '600px' }}>
          <div className='card-header'>
              {listing.imgUrls === undefined ? (
                <Spinner />
              ) : (
                <Swiper 
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={1}
                  slidesPerView={1}
                  coverflowEffect={{
                    rotate:50,
                    stretch:0,
                    depth:100,
                    modifier:1,
                    slideShadows: true
                  }}  
                  pagination={true}
                  className="mySwipe"
                >
                  {listing.imgUrls.map((url,index) => (
                    <SwiperSlide key={index}>
                      <img src={url} height={400} width={800} alt={listing.name}/>
                    </SwiperSlide>
                  ))}
                </Swiper>     
              )}
            </div>
          <div className='card-body'>
            {loading ? (
              <p>Loading...</p> // show a loading message when loading is true
            ) : (
              <>
                <h3>{listing.name}</h3>
                <br/>
                <h6>
                  Price :{' '}
                  {listing.offer
                    ? `${listing.discountedPrice} $ per month.`
                    : `${listing.regularPrice} $ only.`}{' '}
                </h6>
            
                <p>Property For : {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                <p><FaBed/>&nbsp;{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `1 Bedroom`}</p>
                <p>{listing.Parking == 'true' ? 'Parking available' : ''}</p><br/>
                {/* <p>{listing. > 1 ? `${listing.bedrooms} Bedrooms` : `1 Bedroom`}</p> */}
                <Link
                  className='btn btn-dark'
                  to={`/contact/${listing.useRef}?listingName=${listing.name}`}>
                  Contact Landlord
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Listing;