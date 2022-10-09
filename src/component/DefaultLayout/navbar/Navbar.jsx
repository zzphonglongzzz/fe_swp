import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";


const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wraper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchIcon />
        </div>
        <div className="items">
          <div className="item">
            <div className="ava">
              <img
                src="https://images.vexels.com/media/users/3/145908/raw/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
                alt=""
                className="avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
