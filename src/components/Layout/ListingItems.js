import React from 'react'
import { Link } from 'react-router-dom'
import {FaBed} from 'react-icons/fa'
import {FaBath} from 'react-icons/fa'
import {RiDeleteBin5Line} from 'react-icons/ri';
import {FiEdit3} from 'react-icons/fi'
const ListingItems = ({listing,id,onDelete,onEdit}) => {
  return (
    <>
        <div className='d-flex align-items-center justify-content-center'>
            <div className="card  rounded-3 catagory-link" style={{width:"800px"}}>
                <Link to={`/category/${listing.type}/${id}`} >
                    <div className="row container p-3">
                        <div className="col-md-5">
                            <img src={listing.imgUrls[0]} className='img-thumbnail' alt={listing.name} height={200} width={300}/>
                        </div>
                        <div className="col-md-5">
                            <p>{listing.location}</p>
                            <h2>{listing.name}</h2>
                            <p>Rs:{' '}
                                {listing.offer ? listing.discountedPrice:listing.regularPrice}
                                {' '}/-
                                {listing.type==='rent' && ' Per Month'}
                            </p>
                            <p>
                                <FaBed/>&nbsp;
                                {listing.bedrooms > 1? `${listing.bedrooms} Bedrooms`: '1 Bedroom'}
                            </p>
                            <p>
                                <FaBath/>&nbsp;
                                {listing.bathrooms > 1? `${listing.bathrooms} Bathrooms`: '1 Bathroom'}
                            </p>
                        </div>
                    </div>        
                </Link>
            </div>
        </div><br/>
        <div className='d-flex align-items-center justify-content-center'>
            {onDelete && (
                        <button className='btn btn-dark' onClick={() => {onDelete(listing.id,listing.name)}}><RiDeleteBin5Line/>  Delete</button>
            )}
            {onEdit && (
                        <button className='btn btn-dark ms-3' onClick={() => {onEdit(listing.id)}}><FiEdit3/> Edit List</button>
            )}
        </div><br/>
    </>
  )
}

export default ListingItems