import User from "../models/User.js";

// GET /api/users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
};

// PATCH /api/users/:id/role
// ✅ Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    let { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }
    role = String(role);

    const actor = req.user; // set by protect()
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });

    // Prevent self-lockout silliness
    if (String(actor._id) === String(target._id)) {
      return res.status(403).json({ success: false, message: "You cannot change your own role" });
    }

    // ADMIN branch: can only modify USERS and set role to "user" or "admin"
    if (actor.role === "admin") {
      if (target.role === "admin" || target.role === "superAdmin") {
        return res.status(403).json({
          success: false,
          message: "Admins cannot modify other admins or superAdmins",
        });
      }
      if (role !== "user" && role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "Admins can only assign roles: 'user' or 'admin'",
        });
      }
      target.role = role;
    }

    // SUPERADMIN branch: full control (but don’t allow removing own superAdmin)
    else if (actor.role === "superAdmin") {
      if (
        String(actor._id) === String(target._id) &&
        role !== "superAdmin"
      ) {
        return res.status(403).json({
          success: false,
          message: "SuperAdmin cannot remove their own superAdmin role",
        });
      }
      if (!["user", "admin", "superAdmin"].includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
      target.role = role;
    }

    // Everyone else: nope
    else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await target.save();
    const scrubbed = target.toObject();
    delete scrubbed.password;
    return res.status(200).json({ success: true, data: scrubbed, message: "Role updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// PATCH /api/users/:id/block
export const toggleBlockUser = async (req, res) => {
  const targetId = req.params.id;
  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ success: false, message: "User not found" });

  // Admins can block/unblock users only; superAdmin can block/unblock anyone except themselves
  if (req.user.role === "admin" && target.role !== "user") {
    return res
      .status(403)
      .json({ success: false, message: "Admins can block/unblock users only" });
  }
  if (String(req.user.id) === String(target.id)) {
    return res.status(400).json({ success: false, message: "You cannot block/unblock yourself" });
  }

  target.isBlocked = !target.isBlocked;
  await target.save();
  res.json({
    success: true,
    message: `User ${target.isBlocked ? "blocked" : "unblocked"}`,
    data: { _id: target.id, isBlocked: target.isBlocked },
  });
};






