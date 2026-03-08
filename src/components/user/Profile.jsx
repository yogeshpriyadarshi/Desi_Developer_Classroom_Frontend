import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";

function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      const res = await axiosInstance.put("/users/profile", user);
      console.log(res.data);
      setUser(res.data.user);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            user.imageUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={user.email || ""}
            disabled
            className="w-full border p-2 rounded-md bg-gray-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="font-semibold">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="font-semibold">Gender</label>
          <select
            name="gender"
            value={user.gender || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-between">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={updateProfile}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>

            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
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
