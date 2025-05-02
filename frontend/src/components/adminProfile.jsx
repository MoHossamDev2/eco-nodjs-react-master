import { Link } from "react-router-dom";

const AdminProfile = ({currentUser}) => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const activeUser = currentUser || storedUser;
    const isAdmin = activeUser.user.isAdmin;
    return ( 
        <div>
        {isAdmin ? 
            <Link to={"/addProduct"}>add product</Link>
            : <div>you have no access</div>
        }
        </div>
    );
}
 
export default AdminProfile;