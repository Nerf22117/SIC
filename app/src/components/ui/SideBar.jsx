import React from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { LOGOUT } from '../../graphql/mutations/user.mutation';

const SideBar = () => {
  const [logout, { loading }] = useMutation(LOGOUT, {
      refetchQueries: ["GetAuthenticatedUser"],
    });

    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">My Tracker</h1>
      </div>
      <nav className="mt-10">
        <ul>
          <li className="mb-2">
            <Link to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/signin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Food
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/signup" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Exercise
            </Link>
          </li>
        </ul>
        <ul>
          <li className="mt-123">
            {!loading && <div className='bg-red-900 block py-2.5 px-4 transition duration-200 hover:bg-gray-700' onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</div>}
            {loading && (
              <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
            )}
          </li>
        </ul>
        
      </nav>
    </div>
  );
};

export default SideBar;