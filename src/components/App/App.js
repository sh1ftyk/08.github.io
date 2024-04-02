import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { Online, Offline } from 'react-detect-offline'
import { Alert, Layout, Space, Tabs, Spin, Empty } from 'antd'
import { debounce } from 'lodash'

import './App.css'

import MovieService from '../../services/MovieService'
import SearchBar from '../SearchBar/SearchBar'
import ItemList from '../ItemList/ItemList'
import PaginationSlider from '../PaginationSlider/PaginationSlider'

const { TabPane } = Tabs
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
  const [rateValue, setRateValue] = useState([])

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
    setDataLoading(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const getGuestSession = async () => {
    const guestId = sessionStorage.getItem('guestId')
    if (!guestId || guestId === 'undefined' || guestId === null) {
      const newGuestSession = await movieService.guestSession()
      setGuestSession(newGuestSession.guest_session_id)
      sessionStorage.setItem('guestId', newGuestSession.guest_session_id)
    }
    setGuestSession(guestId)
  }

  const getRatedMovies = async (guestId, page = 1) => {
    const ratedMovies = await movieService.getRatedMovies(guestId, page)
    setRatedMovies(ratedMovies.results)
    setRatedTotalItems(ratedMovies.total_results)
    setRatedCurrentPage(ratedMovies.page)
  }

  const setMovieRating = async (id = 0, value = 0) => {
    const movieRating = await movieService.setMovieRating(id, guestSession, value)
    sessionStorage.setItem('id', id)
    sessionStorage.setItem('value', value)
    console.log(movieRating)
    setRateValue({ id: id, value: value })
  }

  const searchMovieCallback = useMemo(() => debounce(handleSearch, 1000), [])

  useEffect(() => {
    getMoviesList(searchValue, 1)
  }, [searchValue])

  useEffect(() => {
    getMoviesList(searchValue, currentPage)
  }, [currentPage])

  useEffect(() => {
    getRatedMovies(sessionStorage.getItem('guestId'), ratedCurrentPage)
  }, [rateValue])

  useEffect(() => {
    getRatedMovies(sessionStorage.getItem('guestId'), ratedCurrentPage)
  }, [ratedCurrentPage])

  const spin =
    dataLoading && searchValue.length !== 0 ? (
      <Spin size="large" style={{ marginTop: '150px' }} />
    ) : (
      <ItemList movies={movies} genres={genres} rateMovie={setMovieRating} rateValue={rateValue.value} />
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
  return (
    <>
      <Online>
        <div className="wrapper">
          <Layout>
            <Content>
              <Tabs defaultActiveKey="1" centered>
                <TabPane className="wrapper__tab" tab="Search" key="1">
                  <SearchBar searchValue={searchMovieCallback} />
                  <Space direction="vertical" align="center">
                    {/* Movie =`ID: {rateValue.id} and Value: {rateValue.value}` */}
                    {spin}
                    {empty}
                    {pagination}
                  </Space>
                </TabPane>
                <TabPane tab="Rated" key="2">
                  <Space direction="vertical" align="center">
                    {/* <div>
                      Movie =`ID: {rateValue.id} and Value: {rateValue.value}`
                    </div> */}
                    {dataLoading && searchValue.length !== 0 ? (
                      <Spin size="large" style={{ marginTop: '150px' }} />
                    ) : (
                      <ItemList
                        movies={ratedMovies}
                        genres={genres}
                        rateMovie={setMovieRating}
                        rateValue={rateValue.value}
                      />
                    )}
                    {movies.length === 0 && !dataLoading ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Rated Movies" />
                    ) : null}
                    {movies.length !== 0 && !dataLoading ? (
                      <PaginationSlider
                        total={ratedTotalItems}
                        currentPage={ratedCurrentPage}
                        setCurrentPage={setRatedCurrentPage}
                      />
                    ) : null}
                  </Space>
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
        </div>
      </Online>
      <Offline>{internetProblem}</Offline>
    </>
  )
}
export default App
