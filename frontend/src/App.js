import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/SpotIndex";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import EditSpotForm from "./components/EditSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path='/' component={SpotIndex}></Route>
        <Route path="/login"></Route>
        <Route exact path='/spots/new' component={CreateSpotForm}></Route>
        <Route exact path='/spots/current' component={ManageSpots}></Route>
        <Route path='/spots/:id/edit' component={EditSpotForm}></Route>
        <Route path='/spots/:spotId' component={SpotDetails}></Route>
        <Route path="/signup"></Route>
      </Switch>}
    </>
  );
}

export default App;
