import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { Layout } from "../components/layout/Layout"
import { InvoiceHome } from "../components/invoice/InvoiceHome"


export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<InvoiceHome />} />
          <Route path="home" element={<InvoiceHome />} />
        </Route>
        <Route path="*" element={
            <>
                <h1>Error 404</h1>
                <Link to='/'>Volver a Inicio</Link>
            </>
        } />
      </Routes>
    </BrowserRouter>
  );
}
