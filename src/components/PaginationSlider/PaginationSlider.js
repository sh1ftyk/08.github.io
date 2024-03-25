import React from 'react'
import { Pagination } from 'antd'

import './PaginationSlider.css'

const PaginationSlider = ({ total, onChange, searchValue }) => {
  return (
    <Pagination
      className="container__pagination pagination"
      defaultCurrent={1}
      defaultPageSize={20}
      total={total}
      showTotal={(total, range) => {
        if (total === 1) {
          return `${total} movie found`
        } else {
          return `${range[0]} - ${range[1]} of ${total} movies found`
        }
      }}
      onChange={(page) => onChange(searchValue, page)}
      showSizeChanger={false}
    />
  )
}

export default PaginationSlider
