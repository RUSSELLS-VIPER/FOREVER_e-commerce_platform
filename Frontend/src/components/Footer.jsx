import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} alt="" className='mb-5 w-33' />
          <p className='w-full md:w-2/3 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, sit? Temporibus soluta sequi fugiat, beatae quos eos aspernatur quasi dolores quibusdam culpa, odit consectetur, asperiores saepe dolorem facere veniam eveniet eaque aliquid explicabo sit! Sequi nam a, debitis aperiam iusto quas ullam totam, assumenda at quod animi explicabo voluptatum voluptas?
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+1234567890</li>
            <li>email@mail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, cupiditate?
        </p>
      </div>
    </div>
  )
}

export default Footer
