import { Provider } from "react-redux"
import Products from "./pages/Products"
import store from "./util/store"
import { HashRouter, Route, Routes } from "react-router-dom"
import ProductDetail from "./pages/ProductDetails"
import Navbar from "./componants/Navbar"
import DoctorNearby from "./pages/DoctorNearby"
import CustomerLogin from "./pages/CustomerLogin"

function App() {

  return (
    <>
    <Provider  store={store}>
      <div className="sticky">
      <Navbar/>
      </div>
      
      <HashRouter>
        <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/nearbyDoctors" element={<DoctorNearby/>} />
        <Route path="/login" element={<CustomerLogin/>} />
        </Routes>
      
       </HashRouter>
       </Provider>
       
    </>
  )
}

export default App
