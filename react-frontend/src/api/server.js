import { setServerReachable, setServerNotReachable } from '../slices/serverSlice';

import { SERVER_DOMAIN } from '../utils/authUtils';

const checkServerAvailability = () => async (dispatch) => {
  try {
    // make a dummy request to the server
    const response = await fetch(`${SERVER_DOMAIN}/health-check`);

    // assuming the server is reachable if the dummy request is successful
    dispatch(setServerReachable());
  } catch (error) {
    // server is not reachable
    dispatch(setServerNotReachable());
  }
};

export default checkServerAvailability;