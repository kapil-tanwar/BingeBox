import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Page chrome. `flush` lets artwork run under the navigation (home, details);
 * otherwise content is pushed below it.
 */
const Shell = ({ children, flush = false, footer = true }) => (
  <div className="relative min-h-screen bg-ink">
    <Navbar />
    <main id="main" className={flush ? "" : "pt-[var(--nav-h)]"}>
      {children}
    </main>
    {footer && <Footer />}
  </div>
);

export default Shell;
