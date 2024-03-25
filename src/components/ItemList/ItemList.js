import React from 'react'
import { Spin } from 'antd'

import Item from '../Item/Item'
import './ItemList.css'

const ItemList = ({ movies, dataLoading }) => {
  let showItem
  if (dataLoading) {
    showItem = <Spin style={{ margin: 'auto' }} />
  } else {
    showItem = <Item movies={movies} />
  }

  return (
    <div className="container">
      <ul className="container__list list">{showItem}</ul>
    </div>
  )
}

export default ItemList
