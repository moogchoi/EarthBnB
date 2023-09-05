import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/SpotIndex";
import SpotDetails from "./components/SpotDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path='/'>
          <SpotIndex />
        </Route>
        <Route exact path='/spots/:spotId'>
          <SpotDetails />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
