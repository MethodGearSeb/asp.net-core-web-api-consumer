import axios from 'axios'
import { Product } from './types'

const baseUrl = 'http://localhost:5080'

const productService = {
  getProducts() {
    return axios.get(baseUrl).then(response => response.data)
  },
  addProduct(name: string, price: number) {
    return axios.post(baseUrl, { name, price }).then(response => response.data)
  },
  updateProduct(product: Product) {
    return axios
      .put(`${baseUrl}/${product.id}`, product)
      .then(response => response.data)
  },
  deleteProduct(id: number) {
    return axios.delete(`${baseUrl}/${id}`)
  },
}

export default productService
