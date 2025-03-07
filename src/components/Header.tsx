import { Link } from "react-router-dom";

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <header className="dashboard-header">
      <nav className="header-nav">
        <Link to="/dashboard" className="header-brand">
          Task Manager
        </Link>
        <div className="header-links">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
