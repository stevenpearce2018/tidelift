import { useEffect, useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/:platform/:name">
        <Package />
      </Route>
      </Switch>
    </Router>
    
  );
}

const Home = () =>
  <div>
    <h1>Welcome to the thunder dome!</h1>
    <h2>Type a platform/library into the URL to learn more...</h2>
    <a href='/npm/mocha' color={{ color: "white" }}>Click to learn about npm, mocha</a>
  </div>

const Package = () => {
  const [packageInfo, setPackageInfo] = useState({});
  const [dependencyInfo, setDependencyInfo] = useState([]);
  const { platform, name } = useParams();

  useEffect(() => {
    // !todo, abstract API_KEYs to environment. Don't publicly expose via git/external site.
    fetch(`https://libraries.io/api/${platform}/${name}?api_key=d3eb97492c5d44960268fbaf451e5ad6`)
      .then(response => response.json())
      .then(packageInfo => setPackageInfo(packageInfo));

    fetch(`https://libraries.io/api/${platform}/${name}/latest/dependencies?api_key=d3eb97492c5d44960268fbaf451e5ad6`)
      .then(response => response.json())
      .then(dependencyInfo => setDependencyInfo(dependencyInfo));
    
  }, [])
  
  return (
    <div>
      <h1>Package information for {platform}, {name}</h1>
      <h2>License: {packageInfo?.repository_license}</h2>
      <h3>Versions:</h3>
      {packageInfo?.versions?.map(({number, published_at}, index) => <p key={`version-${index}`}>{number}, {published_at}</p>)}
      <h3>Dependencies:</h3>
      {dependencyInfo?.dependencies?.map(({name}, index) => <a key={`dependency-${index}`} target="_blank" rel="noopener noreferrer" href={`https://www.npmjs.com/package/${name}`}>{name}</a>)}
    </div>
  );
}

export default App;
