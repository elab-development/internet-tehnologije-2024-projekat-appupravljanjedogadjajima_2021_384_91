import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs() {
  const location = useLocation();

  // trenutna putanja (npr. /events, /calendar)
  const pathnames = location.pathname.split("/").filter((x) => x);

  // ako je na početnoj ("/"), breadcrumb se ne prikazuje
  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs">
      <ul>
        <li>
          <Link to="/">Početna</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          // lepo formatiraj naziv (veliko početno slovo)
          const formatted = name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={name}>
              {isLast ? (
                <span>{formatted}</span>
              ) : (
                <Link to={routeTo}>{formatted}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
