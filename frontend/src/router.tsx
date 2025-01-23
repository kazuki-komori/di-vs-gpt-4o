import { Route, Routes } from "react-router"

import { TopPage } from "./pages"

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
    </Routes>
  )
}
