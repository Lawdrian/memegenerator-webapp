import { setServerReachable, setServerNotReachable } from '../slices/serverSlice';

const checkServerAvailability = () => async (dispatch) => {
  try {
    // make a dummy request to the server
    const response = await fetch('http://localhost:3001/health-check');

    // assuming the server is reachable if the dummy request is successful
    dispatch(setServerReachable());
  } catch (error) {
    // server is not reachable
    dispatch(setServerNotReachable());
  }
};

export default checkServerAvailability;