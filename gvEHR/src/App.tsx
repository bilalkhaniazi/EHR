import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FlexSheet } from './components/flexSheet.tsx'
import OrdersPage from './components/ordersPage.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<FlexSheet />} />
          <Route path="/table" element={<FlexSheet />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes> 
    </BrowserRouter>
  )
}

export default App
