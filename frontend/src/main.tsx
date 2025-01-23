import { MantineProvider } from "@mantine/core"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import "@mantine/core/styles.css"

import { Router } from "@/router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={{ fontFamily: "Noto Sans JP" }}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
