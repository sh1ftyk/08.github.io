// class MoviesApi {
//   async getResource(url) {
//     const authKey = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         Authorization:
//           'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjBjM2JkNjYyMjNkNzBmNzgxZmVmMTY5NzI2NmQ3MiIsInN1YiI6IjY1ZjZlZGI4NTk0Yzk0MDE3YzM4MDI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tSf3eYNq1cBFr7JSvqeiatdhTp49ZCcBdirJ31qJwAs',
//       },
//     }
//     const res = await fetch(url, authKey)

//     if (!res.ok) {
//       throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
//     }
//     return await res.json()
//   }

//   async getMoviesList() {
//     const res = await this.getResource(
//       'https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US&page=1'
//     )
//     return res.results
//   }
// }

// // const moviesList = new MoviesApi()

// // moviesList.getMoviesList().then((body) => {
// //   console.log(body)
// // })

// // moviesList.getMoviesList().then((body) => {
// //   body.forEach((el) => {
// //     let { title, overview, release_date, ...rest } = el
// //     console.log(rest)
// //   })
// // })

// export default MoviesApi
