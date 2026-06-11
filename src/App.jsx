
import './App.css'
import ProductCard from './components/ProductCard'
function App() {

  return (
    <>
      <ProductCard
        name="MacBook Air"
        price="LKR.250,000.00"
        image="https://picsum.photos/id/0/5000/3333"
      />

      <ProductCard
        name="i-Phone 16 Pro Max"
        price="LKR.150,000.00"
        image="https://picsum.photos/id/3/5000/3333"
      />

      <ProductCard
        name="i-Digital Pen"
        price="LKR.25,000.00"
        image="https://picsum.photos/id/4/5000/3333"
      />
      <ProductCard
        name="i-Digital Pen"
        price="LKR.25,000.00"
        image="https://picsum.photos/id/4/5000/3333"
      />
    </>
  )
}

export default App
