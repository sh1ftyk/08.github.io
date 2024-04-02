import React from 'react'
import { Rate } from 'antd'

const Rating = ({ rateMovie, movieId, rating }) => {
  return <Rate count={10} value={rating} onChange={(rate) => rateMovie(movieId, rate)} />
}

export default Rating
