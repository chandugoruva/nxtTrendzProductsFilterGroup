import './index.css'

const FiltersGroup = props => {
  const {
    inputSearchValue,
    categoryOptions,
    ratingsList,
    categoryClicked,
    ratingClicked,
    filtersCleared,
    enterClicked,
  } = props
  const inputValue = event => {
    inputSearchValue(event.target.value)
  }

  const enterValue = event => {
    if (event.key === 'Enter') {
      enterClicked()
    }
  }

  const clearFilters = () => {
    filtersCleared()
  }

  return (
    <div className="filters-group-container">
      <input
        type="search"
        className="input-search"
        onChange={inputValue}
        onKeyDown={enterValue}
      />
      <div className="category">
        <h1 className="category-heading">Category</h1>
        {categoryOptions.map(each => (
          <p
            className="category-button"
            onClick={() => categoryClicked(each.categoryId)}
          >
            {each.name}
          </p>
        ))}
      </div>
      <div className="rating">
        <h1 className="rating-heading">Rating</h1>
        {ratingsList.map(each => (
          <button
            type="button"
            className="category-button"
            onClick={() => ratingClicked(each.ratingId)}
          >
            {' '}
            <img
              src={each.imageUrl}
              alt={`rating ${each.ratingId}`}
              className="rating-img"
            />
          </button>
        ))}
      </div>
      <button type="button" className="button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
