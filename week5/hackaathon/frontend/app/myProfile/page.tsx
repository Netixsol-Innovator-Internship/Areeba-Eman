"use client";

import { useState, useEffect } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/api/apiSlice"; // create hooks in your apiSlice
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function MyProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const pathname = usePathname();

  const [editSection, setEditSection] = useState<"personal" | "address" | "traffic" | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    nationality: "",
    idType: "",
    idNo: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    nationality: "",
    city: "",
    country: "",
    address1: "",
    address2: "",
  });
  const [trafficInfo, setTrafficInfo] = useState({
    driverLicenseNumber: "",
    plateCode: "",
    plateNumber: "",
    plateState: "",
    issueCity: "",
  });

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        fullName: profile.fullName || "",
        mobileNumber: profile.mobileNumber || "",
        email: profile.email || "",
        nationality: profile.nationality || "",
        idType: profile.idType || "",
        idNo: profile.idNo || "",
      });
      setAddressInfo({
        nationality: profile.nationality || "",
        city: profile.city || "",
        country: profile.country || "",
        address1: profile.address1 || "",
        address2: profile.address2 || "",
      });
      setTrafficInfo({
        driverLicenseNumber: profile.driverLicenseNumber || "",
        plateCode: profile.plateCode || "",
        plateNumber: profile.plateNumber || "",
        plateState: profile.plateState || "",
        issueCity: profile.issueCity || "",
      });
    }
  }, [profile]);

  if (isLoading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found</p>;

  const handleSave = async (section: "personal" | "address" | "traffic") => {
    try {
      let payload = {};
      if (section === "personal") payload = personalInfo;
      if (section === "address") payload = addressInfo;
      if (section === "traffic") payload = trafficInfo;

      await updateProfile(payload).unwrap();
      alert("Profile updated successfully");
      setEditSection(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div>
        {/* Heading Section */}
      <div className="bg-blue-200 py-16 flex justify-center items-center mb-6">
        <h2 className="text-4xl font-bold text-blue-900 mb-10">My Profile</h2>
      </div>
    <div className="min-h-screen flex">
        
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 flex flex-col gap-2 text-blue-900">
        <button
          className={`py-2 px-4 text-left rounded border border-gray-300 ${pathname === "/myProfile" ? "bg-blue-100" : ""}`}
          onClick={() => router.push("/myProfile")}
        >
          Personal Info
        </button>
        <button
          className="py-2 px-4 text-left rounded border border-gray-300"
          onClick={() => router.push("/myCars")}
        >
          My Cars
        </button>
        <button
          className="py-2 px-4 text-left rounded border border-gray-300"
          onClick={() => router.push("/myBids")}
        >
          My Bids
        </button>
        <button
          className="py-2 px-4 text-left rounded border border-gray-300"
          onClick={() => router.push("/wishlist")}
        >
          Wishlist
        </button>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Personal Info */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Personal Info</h3>
            <button
              onClick={() =>
                editSection === "personal" ? handleSave("personal") : setEditSection("personal")
              }
              className="text-blue-600 hover:underline"
            >
              {editSection === "personal" ? "Save" : "Edit"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              disabled={editSection !== "personal"}
              value={personalInfo.fullName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
              placeholder="Full Name"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "personal"}
              value={personalInfo.mobileNumber}
              onChange={(e) => setPersonalInfo({ ...personalInfo, mobileNumber: e.target.value })}
              placeholder="Mobile Number"
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              disabled={editSection !== "personal"}
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "personal"}
              value={personalInfo.nationality}
              onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
              placeholder="Nationality"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "personal"}
              value={personalInfo.idType}
              onChange={(e) => setPersonalInfo({ ...personalInfo, idType: e.target.value })}
              placeholder="ID Type"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "personal"}
              value={personalInfo.idNo}
              onChange={(e) => setPersonalInfo({ ...personalInfo, idNo: e.target.value })}
              placeholder="ID Number"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Address Info */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Address</h3>
            <button
              onClick={() =>
                editSection === "address" ? handleSave("address") : setEditSection("address")
              }
              className="text-blue-600 hover:underline"
            >
              {editSection === "address" ? "Save" : "Edit"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              disabled={editSection !== "address"}
              value={addressInfo.nationality}
              onChange={(e) => setAddressInfo({ ...addressInfo, nationality: e.target.value })}
              placeholder="Nationality"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "address"}
              value={addressInfo.city}
              onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
              placeholder="City"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "address"}
              value={addressInfo.country}
              onChange={(e) => setAddressInfo({ ...addressInfo, country: e.target.value })}
              placeholder="Country"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "address"}
              value={addressInfo.address1}
              onChange={(e) => setAddressInfo({ ...addressInfo, address1: e.target.value })}
              placeholder="Address 1"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "address"}
              value={addressInfo.address2}
              onChange={(e) => setAddressInfo({ ...addressInfo, address2: e.target.value })}
              placeholder="Address 2"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Traffic Info */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Traffic Info</h3>
            <button
              onClick={() =>
                editSection === "traffic" ? handleSave("traffic") : setEditSection("traffic")
              }
              className="text-blue-600 hover:underline"
            >
              {editSection === "traffic" ? "Save" : "Edit"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              disabled={editSection !== "traffic"}
              value={trafficInfo.driverLicenseNumber}
              onChange={(e) => setTrafficInfo({ ...trafficInfo, driverLicenseNumber: e.target.value })}
              placeholder="Driver License Number"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "traffic"}
              value={trafficInfo.plateCode}
              onChange={(e) => setTrafficInfo({ ...trafficInfo, plateCode: e.target.value })}
              placeholder="Plate Code"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "traffic"}
              value={trafficInfo.plateNumber}
              onChange={(e) => setTrafficInfo({ ...trafficInfo, plateNumber: e.target.value })}
              placeholder="Plate Number"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "traffic"}
              value={trafficInfo.plateState}
              onChange={(e) => setTrafficInfo({ ...trafficInfo, plateState: e.target.value })}
              placeholder="Plate State"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              disabled={editSection !== "traffic"}
              value={trafficInfo.issueCity}
              onChange={(e) => setTrafficInfo({ ...trafficInfo, issueCity: e.target.value })}
              placeholder="Issue City"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
