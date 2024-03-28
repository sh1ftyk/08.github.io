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
  const [genres, setGenres] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [totalItems, setTotalItems] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const handleChange = (e) => {
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

  const searchMovieCallback = useMemo(() => debounce(handleChange, 1000), [])
  useEffect(() => {
    getMoviesList(searchValue, 1)
  }, [searchValue])

  useEffect(() => {
    getMoviesList(searchValue, currentPage)
  }, [currentPage])

  const spin =
    dataLoading && searchValue.length !== 0 ? (
      <Spin size="large" style={{ marginTop: '150px' }} />
    ) : (
      <ItemList movies={movies} genres={genres} />
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
    <Fragment>
      <Online>
        <div className="wrapper">
          <Layout>
            <Content>
              <Tabs defaultActiveKey="1" centered>
                <TabPane className="wrapper__tab" tab="Search" key="1">
                  <SearchBar onChange={searchMovieCallback} />
                  <Space direction="vertical" align="center">
                    {spin}
                    {empty}
                    {pagination}
                  </Space>
                </TabPane>
                <TabPane tab="Rated" key="2">
                  2nd TAB PANE Content
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
        </div>
      </Online>
      <Offline>{internetProblem}</Offline>
    </Fragment>
  )
}
export default App
