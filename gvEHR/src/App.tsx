import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FlexSheet } from './components/flexSheet.tsx'
import OrdersPage from './components/ordersPage.tsx'
import NotePage from './components/notePage.tsx'
import LabPage from './components/labPage.tsx'
import PatientChartLayout from './components/PatientChartLayout'; // The parent component

const router = createBrowserRouter([
  {
    path: "/patient/:patientId", // Parent route
    element: <PatientChartLayout />,
    children: [
      {
        path: "orders", // e.g., /patient/123/orders
        element: <OrdersPage />,
      },
      {
        path: "notes",  // e.g., /patient/123/notes
        element: <NotePage />,
      },
      {
        path: "labs",
        element: <LabPage />,
      },
      {
        path: "charting",
        element: <FlexSheet />,
      },
    ],
  },
  // ... other routes
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App