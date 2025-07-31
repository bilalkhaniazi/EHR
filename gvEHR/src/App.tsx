import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FlexSheet } from './components/flexSheets/flexSheet.tsx'
import OrdersPage from './components/orders/ordersPage.tsx'
import NotePage from './components/notes/notePage.tsx'
import LabPage from './components/labs/labPage.tsx'
import PatientChartLayout from './components/chart.tsx/PatientChartLayout.tsx'; // The parent component
import OverviewPage from './components/overview/overviewPage.tsx';

const router = createBrowserRouter([
  {
    path: "/", 
    element: <PatientChartLayout />,
    // errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <OverviewPage />
      },
      {
        path: "orders", 
        element: <OrdersPage />,
      },
      {
        path: "notes",   
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