import React from 'react'
import { Card, Typography, Tag, Rate } from 'antd'

import './Item.css'

const { Text } = Typography
const Item = ({ movie, img, date, description, genres = [] }) => {
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
  return (
    <Card hoverable key={movie.id}>
      <img className="card__image" src={img} alt="Movie Poster" />
      <div className="card__title">{movie.title}</div>
      <span className="card__popularity">TEST</span>
      <Text type="secondary" className="title__date">
        {date}
      </Text>
      <div className="title__genre genre">{movieGenre}</div>

      <Text className="title__description">{description}</Text>
      <Rate count={10} />
    </Card>
  )
}

export default Item
