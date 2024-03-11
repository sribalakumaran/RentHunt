import React from 'react';
import {useNavigate} from "react-router-dom";
import Layout from '../components/Layout/Layout'
import Slider from '../components/Slider';

const HomePage = () => {
  const navigate = useNavigate()
  const img1 = "https://img.freepik.com/free-vector/yard-sign-flat-design_23-2148851972.jpg?w=740&t=st=1680194981~exp=1680195581~hmac=cbcfbcf8c39434b2c8e4bb02e3c333d3905043972844d4dd95327ad1db973670"
  const img2 = "https://img.freepik.com/free-vector/sale-concept-illustration_114360-119.jpg?w=740&t=st=1680195097~exp=1680195697~hmac=564421a714982490e2a37299b786cb250cd29489c5be5ccc285c912e3084bd72"
  return (
    <Layout>
            <div className='container'>
              <Slider />
              <br/><br/><br/><br/><hr/><br/><br/><br/>
            {/* ---------------------------------------------------------------------------------------------- */}
                <h1 className='text-center mt-4' style={{color:'#232222'}}>Categories</h1>
                <div className='row  justify-content-center' style={{marginLeft:'10%'}}>
                  <div className='col-md-5'>
                    <br/><br/>
                    <div className="Imagecontainer">
                      <img src={img1} className='rounded-5' style={{height:'300px', width:'300px'}} alt="Rent" />
                      <button className="btn" onClick = {() => navigate("/category/rent")}>To Rent</button>
                      <br/><br/>
                    </div>
                  </div> 
                  <div className='col-md-5'>
                    <br/><br/>
                    <div className="Imagecontainer">
                      <img src={img2} className='rounded-5' style={{height:'300px', width:'300px'}} alt="Rent" />
                      <button className="btn" onClick = {() => navigate("/category/sale")}>To Sale</button>
                      <br/><br/>
                    </div>
                  </div>                
                </div>
            </div>
            <br/><br/><br/><br/><hr/><br/><br/><br/>
            {/* ---------------------------------------------------------------------------------------------- */}
            <div>
              <div className="jumbotron">
                <div className="container">
                  <h1 className="display-2 bold" style={{fontStyle:'bold'}}>Hello Hunters!</h1>
                  <p>Renthunt gives you a new experience in housemarketing. We provide you DHC certified houses for rent and sale. With a high trust among buyers, Renthunt stands top in housemarketing platform. We ensure that buyers get their dreamhouse at low cost. We provide a wide variety of houses with a better environment. </p>
                </div>
              </div>
              <br/><br/><br/>
              <div className="container">
                <div className="row">
                <div className="col-md-4">
                  <h2>Rent Basis</h2>
                  <p>&emsp;Here we permit sellers to rent their houses for lease and for monthly rent. Buyers can rent their desired house based on their availablity. Buyers can meet seller in person or contact them via Email or phone. No commission included.</p>
                </div>
                <div className="col-md-4">
                  <h2>Sale Basis</h2>
                  <p>&emsp;Here Buyers can buy the house at low cost. We ensure that the houses available in renthunt are certified houses with all basic facilities. Seller will give a brief informations about the house in the listings. Buyer can me contact the seller via Email or phone.</p>
                </div>
                <div className="col-md-4">
                  <img src="https://cdn.pixabay.com/photo/2017/11/06/18/30/eggplant-2924511_960_720.png" style={{marginLeft:'100px',height:'250px'}} alt="eggplant"/>
              </div>
            </div>
          </div>
        </div>

            {/* ---------------------------------------------------------------------------------------------- */}
            {/* <div className='container justify-content-center' style={{marginLeft:'200px'}}>
              <div className="row">
                <div className="feature-box col-lg-4">
                  <h3>Explore</h3>
                  <p>Get to know about nearby residentials</p>
                </div>
                <div className="feature-box col-lg-4">
                  <h3>Select your desire</h3>
                  <p>Choose what you want</p>
                </div>
                <div className="feature-box col-lg-4">
                  <h3>User friendly</h3>
                  <p>It takes just 5 min </p>
                </div>
              </div>
          </div> */}
          <br/><br/><br/><br/>

    </Layout>
  )
}

export default HomePage