import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

posthog.init("phc_cHH8RPwyQVB4wMHRzbQAe5s5q0q4g1mOaML8dba37ZC", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
});

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
);
