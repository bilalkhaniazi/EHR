import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FlexSheet } from './components/flexSheet.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<FlexSheet />} />
          <Route path="/table" element={<FlexSheet />} />
        </Routes> 
    </BrowserRouter>
  )
}

export default App
