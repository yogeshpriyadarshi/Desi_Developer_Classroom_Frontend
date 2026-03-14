import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data.user);
      setOriginalUser(res.data.user);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (user.phoneNumber && !/^[0-9]{10}$/.test(user.phoneNumber)) {
      toast.warning("Phone number must be 10 digits");
      return false;
    }
    return true;
  };

  const updateProfile = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axiosInstance.put("/users/profile", user);

      setUser(res.data.user);
      setOriginalUser(res.data.user);
      setEditMode(false);

      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setUser(originalUser);
    setEditMode(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <img
          src={
            user.imageUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
        />
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName || ""}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              editMode ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName || ""}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              editMode ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email || ""}
            disabled
            className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber || ""}
            disabled={!editMode}
            onChange={handleChange}
            placeholder="Enter 10 digit number"
            className={`w-full border rounded-md p-2 ${
              editMode ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={user.gender || ""}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              editMode ? "bg-white" : "bg-gray-100"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-between">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={updateProfile}
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={cancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
