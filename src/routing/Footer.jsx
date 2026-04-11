import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-gray-100 p-4 mt-10 text-center">
      <div className="flex justify-center gap-6 text-sm">
        <Link to="/about">About</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </div>
  );
}

export default Footer;