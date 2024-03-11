import React, { Children } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({children}) => {
  return (
    <>
    <Header/>
    <main style={{minHeight:"83vh",backgroundColor:'#d7dde8'}}>
        {children}
    </main>
    <Footer/>
    </>
  )
}

export default Layout