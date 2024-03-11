import React,{useState,useEffect} from 'react';
import { db } from '../firebase.config';
import {collection,getDocs,query,orderBy,limit} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import SwipeCore,{EffectCoverflow,Navigation,Pagination} from 'swiper';
import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.css';
// import Slider from './Slider';
import Spinner from './Layout/Spinner';

//config
SwipeCore.use([EffectCoverflow,Pagination]);


const Slider = () => {
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const userpic = "https://openclipart.org/download/247319/abstract-user/flat-3.svg";
    
    useEffect(() => {
        const fetchListings = async() => {
            const listingRef = collection(db,'listings')
            const q = query(listingRef,orderBy('timestamp','desc'),limit(5))
            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach(doc => {
                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
        fetchListings()
        console.log(listings === null ? 'loading' : listings);
        //eslint-disable-next-line
    },[]);
    if(loading){
        return <Spinner/>
    }

  return (
    <div className='container-fluid'>
        {listings.imgUrls === null ? (
                <Spinner />
              ) : (
                <Swiper 
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={1}
                  slidesPerView={1}
                  coverflowEffect={{
                    rotate:60,
                    stretch:0,
                    depth:100,
                    modifier:1,
                    slideShadows: true
                  }}  
                  pagination={true}
                  className="mySwipe w-50" 
        
                >
                  {listings.map(({data,id}) => (
                    <SwiperSlide key={id} onClick={() => {navigate(`/category/${data.type}/${id}`)}}>
                        <br/>
                        <h4 className='text-dark p-2 m-0 rounded-4' style={{background:'#757F9A'}}>
                            <img alt="user pic" src={userpic} height={55} width={55}/>
                            <span className='ms-2'> {data.name} </span>
                        </h4>
                      <img src={data.imgUrls[0]} className='p-3' height={520} width={600} alt={data.name}/>
                    </SwiperSlide>
                  ))}
                </Swiper>     
              )}
                {/* {listings === null ? (
                        <Spinner />) : (
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
                        {listings.map(({data, id}) => (
                            <SwiperSlide key={id} onClick={() => {navigate(`/category/${data.type}/${id}`)}}>
                                <h6 className='bg-light text-dark p-2 m-0'>
                                    <img alt="userpic" src={userpic} height={35} width={35}/>
                                    <span className='ms-2'>{data.name}</span>
                                </h6>
                                <img 
                                    src={data.imgUrls[0]} 
                                    height={400} 
                                    width={800} 
                                    alt={data.name}
                                />
                            </SwiperSlide>
                        ))}
                        </Swiper>     
              )} */}
    </div>
  )
}

export default Slider