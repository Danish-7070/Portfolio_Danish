import React, { useEffect, useState } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { BiUser } from "react-icons/bi";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";  

const URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setAllUsers(data.customers);
      setFilteredUsers(data.customers);
    } catch (error) {
      console.log('error', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate indexes for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const blockUser = async (_id) => {
    try {
      setLoading(true);
      setError(null);

      const userToUpdate = allUsers.find((user) => user._id === _id);
      if (!userToUpdate) {
        throw new Error("User not found");
      }

      const response = await axios.put(`${URL}/admin/block-user/${_id}`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.status >= 400) {
        throw new Error(response.data.message);
      }

      await fetchUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = (searchTerm) => {
    setNameSearch(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
    
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="p-20 max-sm:px-0 h-screen">
      <AdminSiderbar />

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="p-5 w-full overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <BiUser className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            <h1>Manage the users</h1>
          </div>
          <div className="flex justify-between items-center mb-4 gap-4">
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => searchUsers(e.target.value)}
              placeholder="Search by name"
              className="p-2 border border-gray-300 rounded-md input w-96"
            />
          </div>
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between py-1 w-full mx-auto">
              <span>{error}</span>
              <div>
                <button className="btn btn-sm border-none" onClick={() => setError(null)}>x</button>
              </div>
            </div>
          )}

          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Address</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:border-gray-700 hover:bg-gray-200 hover:text-gray-700"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.username}
                  </th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="flex items-center px-6 py-4 justify-between">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => document.getElementById(`modal-${index}`).showModal()}
                    >
                      See Details
                    </button>

                    <button
                      onClick={() => blockUser(user._id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </button>

                    <UserInfoModal user={user} modalId={`modal-${index}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number + 1)}
                  className={`btn ${
                    currentPage === number + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  } px-4 py-2 rounded btn`}
                >
                  {number + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const UserInfoModal = ({ user, modalId }) => {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box bg-gray-200 text-black max-w-4xl relative p-6 rounded-lg shadow-lg">
        <h3 className="text-lg mb-4">
          <span className="font-semibold text-secondary">{user.username}</span>
        </h3>

        <div className="grid grid-cols-2 gap-4 text-md leading-7">
          <p>
            <strong>Email:</strong> <span className="ml-4">{user.email}</span>
          </p>
          <p>
            <strong>Phone:</strong> <span className="ml-4">{user.phone}</span>
          </p>
          <p>
            <strong>Address:</strong>{" "}
            <span className="ml-4">{user.address}</span>
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            <span className="ml-4">{formatDate(user.dob, false)}</span>
          </p>
          <p>
            <strong>Points:</strong> <span className="ml-4">{user.points}</span>
          </p>
          <p className="absolute bottom-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-lg font-medium ${
                user.status === "active"
                  ? "bg-green-300 text-green-900"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user.status}
            </span>
          </p>
        </div>

        <button
          onClick={() => document.getElementById(modalId).close()}
          className="btn absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default Users;