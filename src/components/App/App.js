import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { Online, Offline } from 'react-detect-offline'
import { Alert, Layout, Space, Tabs, Spin, Empty } from 'antd'
import { debounce } from 'lodash'

import './App.css'

import MovieService from '../../services/MovieService'
import SearchBar from '../SearchBar/SearchBar'
import ItemList from '../ItemList/ItemList'
import PaginationSlider from '../PaginationSlider/PaginationSlider'

const { Content } = Layout

const movieService = new MovieService()
const App = () => {
  const [movies, setMovies] = useState([])
  const [totalItems, setTotalItems] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const [ratedMovies, setRatedMovies] = useState([])
  const [ratedTotalItems, setRatedTotalItems] = useState(1)
  const [ratedCurrentPage, setRatedCurrentPage] = useState(1)

  const [genres, setGenres] = useState([])

  const [dataLoading, setDataLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  const [guestSession, setGuestSession] = useState('')
  const [rating, setRating] = useState([])
  const rateValue = JSON.parse(sessionStorage.getItem('rateValue'))
  const handleSearch = (e) => {
    setSearchValue(e.target.value)
  }

  const getPopularMovies = async (token, page) => {
    const movies = await movieService.getPopularMovies(token, page)
    setMovies(movies.results)
    setTotalItems(movies.total_results)
    setCurrentPage(movies.page)
  }

  const searchMovies = async (name, page) => {
    const movies = await movieService.searchMovies(name, page)
    setMovies(movies.results)
    setTotalItems(movies.total_results)
    setCurrentPage(movies.page)
  }

  const getGenresList = async () => {
    const genres = await movieService.getGenresList()
    setGenres(genres.genres)
  }

  const getMoviesList = async (name, page) => {
    getGuestSession()
    setDataLoading(true)
    getGenresList()
    if (name) {
      await searchMovies(name, page)
    } else {
      await getPopularMovies(page)
    }
    if (guestSession) {
      getRatedMovies(guestSession)
    }
    setDataLoading(false)
  }

  const getGuestSession = async () => {
    let guestId = sessionStorage.getItem('guestId')
    if (!guestId || guestId === 'undefined' || guestId === null || guestId.length === 0) {
      const newGuestSession = await movieService.guestSession()
      setGuestSession(newGuestSession.guest_session_id)
      guestId = sessionStorage.setItem('guestId', newGuestSession.guest_session_id)
    } else {
      setGuestSession(guestId)
    }
  }

  const getRatedMovies = async (guestId = guestSession, page = 1) => {
    const ratedMovies = await movieService.getRatedMovies(guestId, page)
    setRatedMovies(ratedMovies.results)
    setRatedTotalItems(ratedMovies.total_results)
    setRatedCurrentPage(ratedMovies.page)
  }

  const deleteRatedMovies = async (id, guestId = guestSession) => {
    const rateValue = JSON.parse(sessionStorage.getItem('rateValue'))
    const deleteMovieRating = await movieService.deleteMovieRating(id, guestId)
    rateValue
      ? sessionStorage.setItem('rateValue', JSON.stringify([...rateValue, { id, value: 0 }]))
      : sessionStorage.setItem('rateValue', JSON.stringify([{ id, value: 0 }]))
    setRating(JSON.parse(sessionStorage.getItem('rateValue')))
    console.log(deleteMovieRating)
  }

  const setMovieRating = async (id, value) => {
    const rateValue = JSON.parse(sessionStorage.getItem('rateValue'))
    const movieRating = await movieService.setMovieRating(id, guestSession, value)
    rateValue
      ? sessionStorage.setItem('rateValue', JSON.stringify([...rateValue, { id, value }]))
      : sessionStorage.setItem('rateValue', JSON.stringify([{ id, value }]))
    setRating(JSON.parse(sessionStorage.getItem('rateValue')))
    console.log(movieRating)
  }

  const searchMovieCallback = useMemo(() => debounce(handleSearch, 1000), [])

  useEffect(() => {
    getMoviesList(searchValue, 1)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [searchValue])

  useEffect(() => {
    getMoviesList(searchValue, currentPage)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [currentPage])

  useEffect(() => {
    getMoviesList(searchValue, currentPage)
  }, [rating.length])

  useEffect(() => {
    if (guestSession) {
      getRatedMovies(guestSession, ratedCurrentPage)
    }
  }, [rating])

  useEffect(() => {
    if (guestSession) {
      getRatedMovies(guestSession, ratedCurrentPage)
    }
  }, [!dataLoading])

  useEffect(() => {
    if (guestSession) {
      getRatedMovies(guestSession, ratedCurrentPage)
    }
  }, [ratedCurrentPage])

  const spin =
    dataLoading && searchValue.length !== 0 ? (
      <Spin size="large" style={{ marginTop: '150px' }} />
    ) : (
      <ItemList
        movies={movies}
        ratedMovies={ratedMovies}
        genres={genres}
        rateMovie={setMovieRating}
        deleteMovie={deleteRatedMovies}
      />
    )
  const empty =
    movies.length === 0 && !dataLoading ? (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Movies not Found" />
    ) : null
  const pagination =
    movies.length !== 0 && !dataLoading ? (
      <PaginationSlider total={totalItems} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    ) : null
  const internetProblem = (
    <Alert
      message="Connection Problem"
      description="Check your internet connection."
      type="error"
      closable={true}
      showIcon
      banner={true}
    />
  )
  const items = [
    {
      key: '1',
      label: 'Search',
      children: (
        <div className="wrapper__tab">
          <SearchBar searchValue={searchMovieCallback} />
          <Space direction="vertical" align="center">
            {spin}
            {empty}
            {pagination}
          </Space>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: (
        <div className="wrapper__tab">
          <Space direction="vertical" align="center">
            {dataLoading && !ratedMovies ? (
              <Spin size="large" style={{ marginTop: '150px' }} />
            ) : (
              <ItemList
                movies={ratedMovies}
                genres={genres}
                rateMovie={setMovieRating}
                deleteMovie={deleteRatedMovies}
                rateValue={rateValue}
              />
            )}
            {(!ratedMovies && !dataLoading) || (ratedMovies && ratedMovies.length === 0) ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Rated Movies" />
            ) : null}
            {ratedMovies && ratedMovies.length >= 1 ? (
              <PaginationSlider
                total={ratedTotalItems}
                currentPage={ratedCurrentPage}
                setCurrentPage={setRatedCurrentPage}
              />
            ) : null}
          </Space>
        </div>
      ),
    },
  ]
  return (
    <>
      <Online>
        <div className="wrapper">
          <Layout>
            <Content>
              <Tabs
                defaultActiveKey="1"
                centered
                items={items}
                onChange={(cb) => {
                  if (+cb === 2) {
                    if (guestSession) {
                      getRatedMovies(guestSession, 1)
                    }
                  } else {
                    if (guestSession) {
                      getPopularMovies()
                    }
                  }
                }}
              ></Tabs>
            </Content>
          </Layout>
        </div>
      </Online>
      <Offline>{internetProblem}</Offline>
    </>
  )
}
export default App
