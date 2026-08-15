import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={styles.nav}>
      <Link to="/home">Home</Link>
      <Link to="/my-items">My Posts</Link>
      <Link to="/chat">Chat</Link>
    </div>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    background: "#fff",
    borderTop: "1px solid #ccc",
    padding: "10px"
  }
};

export default Navbar;