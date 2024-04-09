import React from 'react'
import { Card, Typography, Tag, Rate } from 'antd'

import './Item.css'

const { Text } = Typography
const Item = ({ movie, img, date, popularity, description, genres = [], rateMovie, rateValue, deleteMovie }) => {
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
      <Rate
        count={10}
        value={rateValue}
        onChange={(rate) => {
          if (rate === 0) {
            deleteMovie(movie.id)
          } else {
            rateMovie(movie.id, rate)
          }
        }}
      />
    </Card>
  )
}

export default Item
