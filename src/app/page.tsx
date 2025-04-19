import React from 'react'
import { Poppins } from "next/font/google";

import Header from './components/ui/landing/Header'
import Hero from './components/ui/landing/Hero'
import FeaturedCategories from './components/ui/landing/FeaturedCategories'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const page = () => {
  return (
    <div className='font-poppins text-[#1A1D23] bg-[#FEFFFE]'>
      <Header />
      <Hero />
      <FeaturedCategories />
    </div>
  )
}

export default page