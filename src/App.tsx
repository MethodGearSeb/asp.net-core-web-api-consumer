import { useEffect, useState } from 'react'
import { Product } from './types'
import productService from './productService'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Container,
  Button,
  Input,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [edit, setEdit] = useState(0)
  const [name, setName] = useState<string | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)

  function createDeletionHandler(id: number) {
    return async () => {
      await productService.deleteProduct(id)
      refreshProducts()
    }
  }

  function createUpdateHandler(id: number) {
    return async () => {
      if (!name || price == null) return
      await productService.updateProduct({ id, name, price })
      tearEditorDown()
      refreshProducts()
    }
  }

  async function refreshProducts() {
    const freshProducts = await productService.getProducts()
    setProducts(freshProducts)
  }

  function handleExpansion(_, isOpening: boolean) {
    setExpanded(isOpening)
    if (!isOpening) return
    tearEditorDown()
    setName('')
    setPrice(0)
  }

  async function handleNewProduct() {
    if (!name || price == null) return
    await productService.addProduct(name, price)
    tearEditorDown()
    setExpanded(false)
    refreshProducts()
  }

  function setEditorUp(product: Product) {
    return () => {
      setExpanded(false)
      setEdit(product.id)
      setName(product.name)
      setPrice(product.price)
    }
  }

  function tearEditorDown() {
    setEdit(0)
    setName(null)
    setPrice(null)
  }

  useEffect(() => {
    ;(async () => {
      const products = await productService.getProducts()
      setProducts(products)
    })()
  }, [])

  return (
    <Container>
      <Table>
        <TableBody>
          {products.map(product => {
            if (product.id !== edit)
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Button onClick={setEditorUp(product)}>Muokkaa</Button>
                    <Button onClick={createDeletionHandler(product.id)}>
                      Poista
                    </Button>
                  </TableCell>
                </TableRow>
              )
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={createUpdateHandler(product.id)}>
                    Tallenna
                  </Button>
                  <Button onClick={tearEditorDown}>Peru</Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Accordion onChange={handleExpansion} expanded={expanded}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Luo uusi tuote</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Input
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
          <Input
            type="number"
            value={price}
            onChange={({ target: { value } }) => setPrice(Number(value))}
          />
          <Button onClick={handleNewProduct}>Tallenna</Button>
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}

export default App
