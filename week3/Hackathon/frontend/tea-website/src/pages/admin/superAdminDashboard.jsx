import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../redux/slices/productApiSlice";
import {
  useGetUsersQuery,
  useChangeRoleMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../../redux/slices/userApiSlice";
import { ROLES } from "../../utils/roles";
import { toast } from "react-toastify";
import { useRef } from "react";

const SuperAdminDashboard = () => {
  const { data: prodData } = useGetProductsQuery({});
  const products = prodData?.data || [];
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { data: usersData } = useGetUsersQuery();
  const users = usersData?.data || [];
  const [changeRole] = useChangeRoleMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  const imgRef = useRef(null);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value;
    const price = form.price.value;
    const imageFile = imgRef.current?.files?.[0];

    const fd = new FormData();
    fd.append('name', name);
    fd.append('price', price);
    if (imageFile) fd.append('image', imageFile);

    try {
      await addProduct(fd).unwrap();
      toast.success("Product created");
      form.reset();
    } catch (e) {
      toast.error(e?.data?.message || "Create failed");
    }
  };

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

  const handleDeleteProduct = async (p) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    try {
      await deleteProduct(p._id).unwrap();
      toast.success("Product deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Delete failed");
    }
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
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

      {/* Create product */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Create Product</h2>
        <form onSubmit={handleCreateProduct} className="border rounded p-4 flex flex-col gap-3 max-w-md">
          <input name="name" placeholder="Name" className="border p-2 rounded" required />
          <input name="price" placeholder="Price" type="number" step="0.01" className="border p-2 rounded" required />
          <input ref={imgRef} type="file" accept="image/*" className="border p-2 rounded" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">Create</button>
        </form>
      </section>

      {/* Product list with edit/delete */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm opacity-70">Price: {p.variants?.[0]?.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProductUpdate(p)}
                  className="px-3 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p)}
                  className="px-3 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Users management full control */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u._id} className="border rounded p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{u.name} — {u.email}</p>
                  <p className="text-sm opacity-70">Role: {u.role} {u.blocked ? '(Blocked)' : ''}</p>
                </div>
                <button
                  onClick={() => handleBlockToggle(u)}
                  className="px-3 py-1 border rounded"
                >
                  {u.blocked ? "Unblock" : "Block"}
                </button>
              </div>

              <div className="flex gap-2 mt-3">
                {u.role !== ROLES.USER && (
                  <button
                    onClick={() => handleRoleChange(u, ROLES.USER)}
                    className="px-3 py-1 border rounded"
                  >
                    Make User
                  </button>
                )}
                {u.role !== ROLES.ADMIN && (
                  <button
                    onClick={() => handleRoleChange(u, ROLES.ADMIN)}
                    className="px-3 py-1 border rounded"
                  >
                    Make Admin
                  </button>
                )}
                {u.role !== ROLES.SUPER_ADMIN && (
                  <button
                    onClick={() => handleRoleChange(u, ROLES.SUPER_ADMIN)}
                    className="px-3 py-1 border rounded"
                  >
                    Make SuperAdmin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
