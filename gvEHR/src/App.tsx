import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FlexSheet } from './components/flexSheet.tsx'
import OrdersPage from './components/ordersPage.tsx'
import NotePage from './components/notePage.tsx'
import LabPage from './components/labPage.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<FlexSheet />} />
          <Route path="/table" element={<FlexSheet />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/notes" element={<NotePage />} />
          <Route path="/labs" element={<LabPage />} />
        </Routes> 
    </BrowserRouter>
  )
}

export default App
