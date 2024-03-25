import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Online, Offline } from 'react-detect-offline'
import { Alert, Space } from 'antd'
import { debounce } from 'lodash'
import './App.css'

import SearchBar from '../SearchBar/SearchBar'
import ItemList from '../ItemList/ItemList'
import PaginationSlider from '../PaginationSlider/PaginationSlider'

const App = () => {
  const [movies, setMovies] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(1)

  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  const getMovieRequest = async (input, page) => {
    if (page > 110) {
      return null
    }
    const url = `https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=en-US&page=${page}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjBjM2JkNjYyMjNkNzBmNzgxZmVmMTY5NzI2NmQ3MiIsInN1YiI6IjY1ZjZlZGI4NTk0Yzk0MDE3YzM4MDI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tSf3eYNq1cBFr7JSvqeiatdhTp49ZCcBdirJ31qJwAs',
      },
    }
    setDataLoading(true)
    try {
      const response = await fetch(url, options)
      const responseJson = await response.json()
      setMovies(responseJson.results)
      setTotalPages(responseJson.total_pages)
      setTotalItems(responseJson.total_results)
    } catch (err) {
      console.log(err)
    }

    setDataLoading(false)
  }

  const debounceGetMovieRequest = useCallback(debounce(getMovieRequest, 1000), [])

  useEffect(() => {
    debounceGetMovieRequest(searchValue, totalPages)
  }, [searchValue])

  return (
    <Fragment>
      <Online>
        <div className="wrapper">
          <SearchBar value={searchValue} onChange={handleChange} />
          {movies.length < 1 ? (
            <Space
              direction="vertical"
              style={{
                width: '100%',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              <Alert message="Nothing Was Found" description="Check your request." type="info" />
            </Space>
          ) : (
            <React.Fragment>
              <ItemList dataLoading={dataLoading} movies={movies} />
              <PaginationSlider total={totalItems} onChange={getMovieRequest} searchValue={searchValue} />
            </React.Fragment>
          )}
        </div>
      </Online>
      <Offline>
        <Space
          direction="vertical"
          style={{
            width: '100%',
            marginTop: '300px',
            textAlign: 'center',
          }}
        >
          <Alert message="Connection Problem" description="Check your internet connection." type="error" />
        </Space>
      </Offline>
    </Fragment>
  )
}
export default App
