import { useGetProductsQuery, useUpdateProductMutation } from "../../redux/slices/productApiSlice";
import { useGetUsersQuery, useChangeRoleMutation, useBlockUserMutation, useUnblockUserMutation } from "../../redux/slices/userApiSlice";
import { useSelector } from "react-redux";
import { ROLES } from "../../utils/roles";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const { data: prodData } = useGetProductsQuery({});
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const { data: usersData } = useGetUsersQuery();
  const [changeRole] = useChangeRoleMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  const products = prodData?.data || [];
  const users = usersData?.data || [];

  const canEditProduct = (u) => u?.role === ROLES.ADMIN || u?.role === ROLES.SUPER_ADMIN;

  const handleProductUpdate = async (p) => {
    const newTitle = prompt("New title:", p.name);
    const newPrice = prompt("New price:", p.variants?.[0]?.price);
    if (!newTitle || !newPrice) return;
    try {
      await updateProduct({ id: p._id, body: { name: newTitle, price: Number(newPrice) } }).unwrap();
      toast.success("Product updated");
    } catch (e) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  const canChangeRole = (target) => {
    // Admin: change only USERS (not admins or superAdmins)
    if (user?.role === ROLES.ADMIN) {
      return target?.role === ROLES.USER;
    }
    // Super admin handled in SuperAdminDashboard
    return false;
  };

  const handleRoleChange = async (u, toRole) => {
    try {
      await changeRole({ userId: u._id, role: toRole }).unwrap();
      toast.success("Role updated");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update role");
    }
  };

  const handleBlockToggle = async (u) => {
    try {
      if (u.blocked) {
        await unblockUser(u._id).unwrap();
        toast.success("User unblocked");
      } else {
        await blockUser(u._id).unwrap();
        toast.success("User blocked");
      }
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update block state");
    }
  };

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Product Management (No delete / no create for admin) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Products (Edit title/price)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm opacity-70">Price: {p.variants?.[0]?.price}</p>
              </div>
              {canEditProduct(user) && (
                <button
                  onClick={() => handleProductUpdate(p)}
                  className="px-3 py-1 bg-black text-white rounded"
                  disabled={updating}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* User Management */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Users (Change role: user → admin only, Block/Unblock)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u._id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{u.name} — {u.email}</p>
                <p className="text-sm opacity-70">Role: {u.role} {u.blocked ? '(Blocked)' : ''}</p>
              </div>
              <div className="flex gap-2">
                {canChangeRole(u) && (
                  <>
                    {u.role === ROLES.USER && (
                      <button
                        onClick={() => handleRoleChange(u, ROLES.ADMIN)}
                        className="px-3 py-1 border rounded"
                      >
                        Make Admin
                      </button>
                    )}
                    {u.role === ROLES.ADMIN && (
                      <button className="px-3 py-1 border rounded opacity-50 cursor-not-allowed" disabled>
                        (cannot modify admin)
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => handleBlockToggle(u)}
                  className="px-3 py-1 border rounded"
                >
                  {u.blocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
