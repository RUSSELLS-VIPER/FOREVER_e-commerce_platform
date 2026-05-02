import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const about = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto similique architecto velit saepe odio molestias, aperiam commodi sit. Voluptates facilis porro non nemo pariatur adipisci eum rerum voluptate autem cupiditate.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quos fuga eligendi alias nulla laboriosam libero, ullam minus omnis, possimus ab repellat, nihil repellendus. Dolore officiis quibusdam sunt nisi accusantium?</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia aliquid qui suscipit iusto pariatur totam placeat, minima cumque saepe quisquam. Vitae ad debitis iste aperiam nobis, magnam aspernatur omnis dolorem.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
      <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque consequatur culpa facilis omnis, magni quasi repellat suscipit labore dolorem eligendi recusandae sapiente saepe fugit cumque iure voluptas est? Doloremque, totam?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience: </b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque consequatur culpa facilis omnis, magni quasi repellat suscipit labore dolorem eligendi recusandae sapiente saepe fugit cumque iure voluptas est? Doloremque, totam?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service: </b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque consequatur culpa facilis omnis, magni quasi repellat suscipit labore dolorem eligendi recusandae sapiente saepe fugit cumque iure voluptas est? Doloremque, totam?</p>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default about
