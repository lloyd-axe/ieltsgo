import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const TestPage = lazy(() => import('./pages/TestPage'));
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const EvaluationPage = lazy(() => import('./pages/EvaluationPage'));
const TestIntroPage = lazy(() => import('./pages/TestIntroPage'));
const SelectionPage = lazy(() => import('./pages/SelectionPage'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/evaluation/:skill" element={<EvaluationPage />} />
          <Route path="/test/selection/:skill?/:testType?" element={<SelectionPage />} />
          <Route path="/test/intro/:skill/:isDoublePanel/:testType/:itemId" element={<TestIntroPage />} />
          <Route path='/test/:skill/:isDoublePanel/:testType/:itemId' element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
