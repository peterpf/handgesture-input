import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ContentView from "./ContentView";
import GlobalStyle from "./globalStyles";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

root.render(
  <StrictMode>
    <Fragment>
      <GlobalStyle />
      <ContentView />
    </Fragment>
  </StrictMode>
);
