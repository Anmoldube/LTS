import React from "react";
import { MdClose } from "react-icons/md";

const FormTable = ({ handleSubmit, handleOnChange, handleClose, rest }) => {
  return (
    <div className="formSection bg-white p-4 shadow-md rounded">
      <div className="header flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Add/Edit Record</h2>
        <button className="text-gray-500" onClick={handleClose}>
          <MdClose size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-gray-700 ">Name:</label>
          <input
            className="w-full  border border-gray-300 rounded"
            type="text"
            name="Name"
            value={rest.Name}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Start Date:</label>
          <input
            type="date"
            name="StartDate"
            value={rest.StartDate}
            onChange={handleOnChange}
            className="w-full border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Expiration Date:</label>
          <input
            type="date"
            name="EXP"
            value={rest.EXP}
            onChange={handleOnChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default FormTable;
