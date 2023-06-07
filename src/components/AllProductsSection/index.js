import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const constraintsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  noProducts: 'NOPRODUCTS',
  failure: 'FAILURE',
}

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    inputSearch: '',
    categoryId: '',
    ratingId: '',
    isAvailable: true,
    status: constraintsStatus.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, inputSearch, categoryId, ratingId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${inputSearch}&category=${categoryId}&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        status: constraintsStatus.success,
      })
    }
    if (fetchedData.products.length === 0) {
      this.setState({isAvailable: false, status: constraintsStatus.noProducts})
    } else if (response.ok === false) {
      this.setState({status: constraintsStatus.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  inputSearchValue = input => {
    this.setState({inputSearch: input})
  }

  categoryClicked = id => {
    this.setState({categoryId: id}, this.getProducts)
  }

  ratingClicked = id => {
    this.setState({ratingId: id}, this.getProducts)
  }

  filtersCleared = () => {
    this.setState(
      {inputSearch: '', categoryId: '', ratingId: ''},
      this.getProducts,
    )
  }

  enterClicked = () => {
    this.getProducts()
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, isAvailable, status} = this.state
    let isAvailableProducts
    if (status === 'SUCCESS') {
      isAvailableProducts = (
        <>
          <ProductsHeader
            activeOptionId={activeOptionId}
            sortbyOptions={sortbyOptions}
            changeSortby={this.changeSortby}
          />
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        </>
      )
    } else if (status === 'NOPRODUCTS') {
      isAvailableProducts = (
        <div className="no-products">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
          />
          <h1>No products Found</h1>
          <p>We could not find any products.try other filters</p>
        </div>
      )
    } else if (status === 'FAILURE') {
      isAvailableProducts = (
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
          alt="products failure"
        />
      )
    }

    // TODO: Add No Products View
    return <div className="all-products-container">{isAvailableProducts}</div>
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          inputSearchValue={this.inputSearchValue}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          categoryClicked={this.categoryClicked}
          ratingClicked={this.ratingClicked}
          filtersCleared={this.filtersCleared}
          enterClicked={this.enterClicked}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
