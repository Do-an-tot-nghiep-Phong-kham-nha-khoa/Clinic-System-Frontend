import { Outlet } from "react-router-dom";
import Navbar from "../../components/General/Navbar";

const UserLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default UserLayout;