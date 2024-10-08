import AdminProductList from "../features/admin/components/AdminProductList";
import NavBar from "../features/navbar/Navbar";
import Footer from "../components/Footer";

function AdminHome() {
  return (
    <div>
      <NavBar>
        <AdminProductList></AdminProductList>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default AdminHome;
