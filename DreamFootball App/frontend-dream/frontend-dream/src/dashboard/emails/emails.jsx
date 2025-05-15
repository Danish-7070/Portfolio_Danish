import React, { useEffect, useState } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { dummyEmailData } from "./dummyEmailData";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";

const URL = import.meta.env.VITE_BACKEND_URL;

const Emails = () => {
  // const [emails, setEmails] = useState(dummyEmailData);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/admin/emails`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setEmails(data);
    } catch (error) {
      console.log('error in fetchEmails', error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmails();
  }, []);


  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 10;

  // Calculate indexes for pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-20 max-sm:px-0 h-screen">
      <AdminSiderbar />

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>

      ) : (

        <div className="p-5 overflow-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-xl font-bold">Emails</h1>
            <div className="flex items-center gap-2">
              <MdEmail className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                Showing {indexOfFirstEmail + 1} to{" "}
                {indexOfLastEmail > emails.length ? emails.length : indexOfLastEmail} of {emails.length} entries
              </span>
            </div>
          </div>
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1 w-full mx-auto">
              <span>{error}</span>
              <div>
                <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
              </div>
            </div>
          )}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEmails.map((email, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:border-gray-700 hover:bg-gray-200  hover:text-gray-700"
                >
                  <td className="px-6 py-4">{email.email}</td>
                  <td className="px-6 py-4">{formatDate(email.createdAt)}</td>
                  <td className="flex items-center px-6 py-4">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <MdEmail className="w-6 h-6 text-secondary" />
                      Send Email
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(Math.ceil(emails.length / emailsPerPage)).keys()].map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number + 1)}
                  className={`btn ${currentPage === number + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                    } px-4 py-2 rounded btn hover:bg-blue-800`}
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

export default Emails;
