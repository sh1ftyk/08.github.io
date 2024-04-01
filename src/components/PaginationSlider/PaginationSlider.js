import React from 'react'
import { Pagination } from 'antd'

import './PaginationSlider.css'

const PaginationSlider = ({ total, currentPage, setCurrentPage }) => {
  return (
    <Pagination
      className="container__pagination pagination"
      current={currentPage}
      defaultPageSize={20}
      defaultCurrent={1}
      total={total > 10000 ? 10000 : total}
      onChange={setCurrentPage}
      showSizeChanger={false}
    />
  )
}

export default PaginationSlider
