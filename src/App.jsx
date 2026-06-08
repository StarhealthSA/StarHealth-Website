import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ScrollToTop from './components/ScrollTop';
import BlogDetailPage from './components/blog_detailpage/blog_detailSection';

// Lazy load route components for code splitting
const Homesection = lazy(() => import('./components/home/home_section'));
const DoctorsSection = lazy(() => import('./components/doctors/doctors_section'));
const ContactUs = lazy(() => import('./components/contact/contact_section'));
const Menulist = lazy(() => import('./components/menulist/menu_list'));
const AppoinmentForm = lazy(() => import('./components/appointment_form'));
const PrivacySection = lazy(() => import('./components/privacy/privacy_section'));
const BlogSection = lazy(() => import('./components/blogs/blogs_Section'));
const BlogDetailSection = lazy(() => import('./components/blog_detailpage/blog_detailSection'));

// Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#002333'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </>
  )
}

const AppContent = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Homesection />} />
        <Route path="/doctors" element={<DoctorsSection />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/menulist" element={<Menulist />} />
        <Route path="/booking" element={<AppoinmentForm />} />
        <Route path="/privacy" element={<PrivacySection />} />
        <Route path="/blogs" element={<BlogSection/>}/>
        {/* <Route path="/blog/:id" element={<BlogDetailPage />} /> */}
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
