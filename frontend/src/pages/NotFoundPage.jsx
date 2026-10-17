import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const NotFoundPage = () => (
  <div className="grid min-h-screen place-items-center bg-ink px-5 text-center">
    <div>
      <Logo className="mb-12" />
      <p className="eyebrow">Error 404</p>
      <h1 className="display mt-4 text-[clamp(3rem,9vw,7rem)]">This scene was <em className="text-champagne">cut.</em></h1>
      <Link to="/" className="btn-ghost mt-10">Back to the programme</Link>
    </div>
  </div>
);

export default NotFoundPage;
