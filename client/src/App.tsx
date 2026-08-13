/** Quiet Current: routes keep the public corporate site, quote request, and owner review separate. */
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import QuoteRequest from "./pages/QuoteRequest";
import QuoteReview from "./pages/QuoteReview";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/harness-quote" component={QuoteRequest} />
      <Route path="/admin/quotes" component={QuoteReview} />
      <Route component={Home} />
    </Switch>
  );
}
