export default class MovieService {
  apiKey = 'e60c3bd66223d70f781fef1697266d72'
  baseUrl = 'https://api.themoviedb.org/3/'
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjBjM2JkNjYyMjNkNzBmNzgxZmVmMTY5NzI2NmQ3MiIsInN1YiI6IjY1ZjZlZGI4NTk0Yzk0MDE3YzM4MDI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tSf3eYNq1cBFr7JSvqeiatdhTp49ZCcBdirJ31qJwAs',
    },
  }

  async getDataFromServer(url, options) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`${res.status}`)
      return await res.json()
    } catch (err) {
      console.error('Trouble with fetch: ', err.message)
      return err.message
    }
  }

  async searchMovies(searchQuery = 'return', pageNumber = 1) {
    const url = `${this.baseUrl}search/movie?api_key=${this.apiKey}&include_adult=false&query=${searchQuery}&page=${pageNumber}`
    const body = await this.getDataFromServer(url, this.options)
    return body
  }

  async getRatedMovies(guestSessionToken, pageNumber = 2) {
    const url = `${this.baseUrl}guest_session/${guestSessionToken}/rated/movies?api_key=${this.apiKey}&page=${pageNumber}`
    const body = await this.getDataFromServer(url)
    return body
  }

  async guestSession() {
    const url = `${this.baseUrl}authentication/guest_session/new?api_key=${this.apiKey}`
    const body = await this.getDataFromServer(url)
    return body
  }

  async setMovieRating(id, guestSessionToken, rate) {
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionToken}`
    const body = {
      value: rate,
    }
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }).catch((err) => {
      console.error('Trouble with fetch', err.message)
    })
  }

  async deleteMovieRating(id, guestSessionToken) {
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionToken}`
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    }
    await fetch(url, {
      method: 'DELETE',
      headers,
    })
  }

  async getPopularMovies(pageNumber = 1) {
    const url = `${this.baseUrl}movie/popular?api_key=${this.apiKey}&language=en-US&page=${pageNumber}`
    const body = await this.getDataFromServer(url)
    return body
  }

  async getGenresList() {
    const url = `${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`
    const body = await this.getDataFromServer(url)
    return body
  }
}
