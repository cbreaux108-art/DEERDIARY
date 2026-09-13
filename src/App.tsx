import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { FieldGuide } from "./pages/FieldGuide";
import { Home } from "./pages/Home";
import { Sightings } from "./pages/Sightings";
import { Trophies } from "./pages/Trophies";
import { AppDataProvider } from "./store/AppData";

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/field-guide" element={<FieldGuide />} />
              <Route path="/sightings" element={<Sightings />} />
              <Route path="/trophies" element={<Trophies />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppDataProvider>
  );
}
