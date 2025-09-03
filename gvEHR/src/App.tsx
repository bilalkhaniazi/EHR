import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FlexSheet } from './components/flexSheets/flexSheet.tsx'
import OrdersPage from './components/orders/ordersPage.tsx'
import NotePage from './components/notes/notePage.tsx'
import LabPage from './components/labs/labPage.tsx'
import PatientChartLayout from './components/chart/PatientChartLayout.tsx'; // The parent component
import OverviewPage from './components/overview/overviewPage.tsx';
import Mar from './components/mar/marPage.tsx';
import MainLayout from './components/admin/mainLayout.tsx';
import Formulary from './components/admin/formulary.tsx';
import AdminLanding from './components/admin/adminLanding.tsx';
import Capsis from './components/capsis/capsis.tsx';
import CapsisPatient from './components/capsis/capsisPatient.tsx';

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
        path: "labs",
        element: <LabPage />,
      },
      {
        path: "orders", 
        element: <OrdersPage />,
      },
      {
        path: "mar",
        element: <Mar />
      },
      {
        path: "notes",   
        element: <NotePage />,
      },
      {
        path: "charting",
        element: <FlexSheet />,
      },
    ],
  },
  {
    path: "/admin",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <AdminLanding />
      },
      {
        path: "formulary",
        element: <Formulary />
      },
    ]
  },
  {
    path: "capsis",
    element: <Capsis />
  },
  {
    path: "capsisPatient",
    element: <CapsisPatient />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App