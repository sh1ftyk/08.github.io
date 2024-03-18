import React, { useEffect, useState } from 'react'

import Item from '../Item/Item'
import './ItemList.css'

const ItemList = () => {
  const [movies, setMovies] = useState([])
  const getMovieRequest = async (pageNum) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=return&include_adult=true&language=en-US&page=${pageNum}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjBjM2JkNjYyMjNkNzBmNzgxZmVmMTY5NzI2NmQ3MiIsInN1YiI6IjY1ZjZlZGI4NTk0Yzk0MDE3YzM4MDI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tSf3eYNq1cBFr7JSvqeiatdhTp49ZCcBdirJ31qJwAs',
      },
    }
    const response = await fetch(url, options)
    const responseJson = await response.json()
    setMovies(responseJson.results)
  }

  useEffect(() => {
    getMovieRequest(3)
  }, [])

  return (
    <section className="container">
      <ul className="container__list list">
        <Item movies={movies} />
      </ul>
    </section>
  )
}

export default ItemList
