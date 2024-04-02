import React from 'react'
import { Card, Typography, Tag } from 'antd'

import './Item.css'
import Rating from '../Rating/Rating'

const { Text } = Typography
const Item = ({ movie, img, date, popularity, description, genres = [], rateMovie }) => {
  const movieGenre = (
    <>
      {genres.map((genre) => {
        return (
          <Tag className="genre__tag" key={genre.id}>
            {genre.name}
          </Tag>
        )
      })}
    </>
  )
  let moviePopularity = ['card__popularity']

  if (popularity >= 3 && popularity < 5) {
    moviePopularity.push('--orange ')
  }
  if (popularity >= 5 && popularity < 7) {
    moviePopularity.push('--yellow')
  }
  if (popularity >= 7) {
    moviePopularity.push('--green')
  }

  moviePopularity = `card__popularity ${moviePopularity.join('')}`
  return (
    <Card hoverable key={movie.id}>
      <img className="card__image" src={img} alt="Movie Poster" />
      <div className="card__title">{movie.title}</div>
      <span className={moviePopularity}>{popularity}</span>
      <Text type="secondary" className="title__date">
        {date}
      </Text>
      <div className="title__genre genre">{movieGenre}</div>

      <Text className="title__description">{description}</Text>
      <Rating rateMovie={rateMovie} rating={movie.rating || 0} movieId={movie.id} />
    </Card>
  )
}

export default Item
