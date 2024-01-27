import React, {useEffect} from 'react';

import './App.css';
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom'


//pages
import Home from './pages/Home';
import EditorContainer from './pages/editor/container/EditorContainer';
import Account from './pages/account/Account';
import NotFound from './pages/NotFound';
import CanvasCreator from './pages/CanvasCreator';

//layouts
import RootLayout from './layout/RootLayout';

import { useDispatch, useSelector } from 'react-redux';
import checkServerAvailability from './api/server';
import { saveMeme } from './api/meme';
import { resetMemeCache } from './slices/serverSlice';
import { getDrafts } from './api/draft';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Account />} />
      <Route path="editor/*" element={<EditorContainer />} />
      <Route path="canvas" element={<CanvasCreator />} />
      <Route path="account" element={<Account/>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const cachedMeme = useSelector((state) => state.server.cachedMemes);
  const serverReachable = useSelector((state) => state.server.serverReachable);
  const draftsLoaded = useSelector((state) => state.draft.draftsLoaded);

  // check server availability every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(checkServerAvailability());
    }, 10000);


    // clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if(serverReachable && cachedMeme != [] && cachedMeme !== undefined && cachedMeme.length > 0) {
      console.log("Uploading cached memes");
      cachedMeme.forEach(meme => {
        console.log(meme);
        saveMeme(meme, token);
      });
      dispatch(resetMemeCache());
    }
  }, [serverReachable])
 
  // fetch drafts from database on page load
  useEffect(() => {
    if(token && !draftsLoaded) {
      dispatch(getDrafts(token));
    }
  }, [token, draftsLoaded])


  return (
    <RouterProvider router={router} />
  );
}

export default App;