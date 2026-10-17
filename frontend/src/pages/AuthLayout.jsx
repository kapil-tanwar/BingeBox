import { Link } from "react-router-dom";
import Logo from "../components/Logo";

/** Shared frame for sign-in / sign-up: an editorial statement beside a quiet form. */
const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => (
  <div className="grid min-h-screen bg-ink lg:grid-cols-[1.1fr_1fr]">
    <aside
      className="grain relative hidden overflow-hidden border-r border-white/10 lg:block"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 20% 90%, rgb(var(--champagne) / 0.14), transparent 70%), linear-gradient(160deg, rgb(var(--night)), rgb(3 4 7))",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-14">
        <Logo />
        <div>
          <p className="display max-w-[14ch] text-[clamp(3.5rem,6vw,6.5rem)]">
            Every great night starts with a <em className="text-champagne">frame.</em>
          </p>
          <p className="mt-8 max-w-sm text-sm text-mute">
            Films and series, arranged with care. Sign in to pick up where you left off.
          </p>
        </div>
      </div>
    </aside>

    <main id="main" className="page-enter flex flex-col px-5 sm:px-10">
      <header className="flex h-[var(--nav-h)] items-center justify-between lg:hidden">
        <Logo />
      </header>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="display text-[clamp(2.8rem,6vw,4.4rem)]">{title}</h1>
        <p className="mt-4 text-[15px] text-mute">{subtitle}</p>
        <div className="mt-10">{children}</div>
        <p className="mt-10 text-sm text-mute">{footer}</p>
        <Link to="/" className="btn-quiet mt-8 self-start">← Back to BingeBox</Link>
      </div>
    </main>
  </div>
);

export default AuthLayout;
