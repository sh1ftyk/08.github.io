import React from 'react'
import { format, parseISO } from 'date-fns'

import './Item.css'

import poster from '../../img/noImg.jpg'

const Item = (props) => {
  return (
    <>
      {props.movies.map((movie) => {
        const formatDescription = (string, maxLength) => {
          if (!string) {
            // eslint-disable-next-line quotes
            string = "The film doesn't have a description yet"
            return string
          }
          if (string.length < maxLength) {
            return string + '...'
          } else {
            let trimmedOverview = string.substr(0, maxLength)
            return trimmedOverview.substr(0, Math.min(trimmedOverview.length, trimmedOverview.lastIndexOf(' '))) + '...'
          }
        }

        const formatImg = (url) => {
          const baseImgUrl = 'https://image.tmdb.org/t/p/w500'
          if (url === null) {
            url = poster
            return url
          } else {
            return baseImgUrl + url
          }
        }

        const formatDate = (date) => {
          if (!date) {
            return 'Release date are unknown'
          } else {
            return format(parseISO(date), 'MMMM d, y')
          }
        }
        return (
          <li key={movie.id} className="list__card card">
            <img className="card__image" src={formatImg(movie.poster_path)} alt="Movie Poster" />
            <div className="card__title title">
              <span className="title__name">{movie.title}</span>
              <span className="title__date">{formatDate(movie.release_date)}</span>
              <span className="title__genre">Genre</span>
              <span className="title__description">{formatDescription(movie.overview, 100)}</span>
            </div>
          </li>
        )
      })}
    </>
  )
}

export default Item
