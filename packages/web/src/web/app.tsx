import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";
import Home from "./pages/index";
import Editions from "./pages/editions";
import EditionPage from "./pages/edition";
import Article from "./pages/article";
import Focus from "./pages/focus";
import About from "./pages/about";
import Pioneer from "./pages/pioneer";
import Partner from "./pages/partner";
import Contact from "./pages/contact";
import Search from "./pages/search";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/editions" component={Editions} />
        <Route path="/editions/:slug" component={EditionPage} />
        <Route path="/editions/:slug/:section" component={Article} />
        <Route path="/focus" component={Focus} />
        <Route path="/about" component={About} />
        <Route path="/pioneer" component={Pioneer} />
        <Route path="/partner" component={Partner} />
        <Route path="/contact" component={Contact} />
        <Route path="/search" component={Search} />
        <Route component={NotFound} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
