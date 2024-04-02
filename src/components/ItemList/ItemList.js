import React from 'react'
import { format, parseISO } from 'date-fns'

import Item from '../Item/Item'
import './ItemList.css'
import poster from '../../img/noImg.jpg'

const ItemList = ({ movies = [], genres = [], rateMovie }) => {
  return (
    <div className="card__list">
      {movies.map((movie) => {
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

        const formatGenre = () => {
          if (movie.genre_ids) {
            const formatedGenres = movie.genre_ids.map((id) => {
              const genreId = genres.find((genre) => genre.id === id)

              return genreId
            })
            return formatedGenres
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
        const formatPopularity = (popularity) => {
          return popularity.toFixed(1)
        }

        return (
          <Item
            key={movie.id}
            movie={movie}
            img={formatImg(movie.poster_path)}
            date={formatDate(movie.release_date)}
            description={formatDescription(movie.overview, 100)}
            genres={formatGenre()}
            popularity={formatPopularity(movie.vote_average)}
            rateMovie={rateMovie}
            rate={movie.rating}
            rateValue={movie.rating}
            movieId={movie.id}
          />
        )
      })}
    </div>
  )
}

export default ItemList
