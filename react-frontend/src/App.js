import './App.css';
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom'


//pages
import Home from './pages/Home/Home';
import EditorContainer from './pages/editor/container/EditorContainer';
import Account from './pages/account/Account';
import NotFound from './pages/NotFound';

//layouts
import RootLayout from './layout/RootLayout';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Home />} />
      <Route path="editor" element={<EditorContainer />} />
      <Route path="account" element={<Account/>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;