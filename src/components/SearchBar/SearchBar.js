import React from 'react'
import { Input } from 'antd'
import './SearchBar.css'

const SearchBar = ({ value, searchValue }) => {
  return (
    <form
      className="header__form form"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <Input
        className="form__search search"
        type="search"
        placeholder="Type to Search..."
        value={value}
        onChange={searchValue}
        size="large"
        autoFocus
        allowClear
      />
    </form>
  )
}
export default SearchBar
