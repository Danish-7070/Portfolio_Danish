import React, { useEffect, useState } from 'react'
import AddBookingForm from '../../components/booking/addBookingForm'
import AdminSiderbar from '../../components/sidebar/sidebar'
import dfawallpaper from '../../assets/dfa-wallpaper.png'
import axios from 'axios';
import toast from 'react-hot-toast';

const URL = import.meta.env.VITE_BACKEND_URL;

const AddBooking = ({setActiveTab}) => {
  const [customers, setCustomers] = useState([]);
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/admin/customers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setCustomers(data.customers || []);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchGrounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/grounds`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setGrounds(data.grounds || []);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
    fetchGrounds();
  }, []);

  const handleAddBookingFormSubmit = async (booking) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${URL}/bookings`, booking, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      toast.success("Booking added successfully");
      setActiveTab('View Bookings');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="" style={{ backgroundImage: `url(${dfawallpaper})`, backgroundSize: "contain" }}>
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>

      ) : (
        <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3">
          {error && (
            <div role="alert" className="alert alert-error leading-tight flex justify-between  py-1 w-full mx-auto">
              <span>{error}</span>
              <div>
                <button className="btn btn-sm border-none " onClick={() => setError(null)}>x</button>
              </div>
            </div>
          )}
          <AddBookingForm groundsData={grounds} customersData={customers} onSubmit={handleAddBookingFormSubmit} />
        </div>
      )}
    </div>
  )
}

export default AddBooking
