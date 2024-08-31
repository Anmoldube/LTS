import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, Button, Input, Select, Spin } from "antd";
import { UnorderedListOutlined, AreaChartOutlined } from "@ant-design/icons";
import Analytics from "../Analytics";
import ReactToPrint from "react-to-print";

const Home = () => {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [frequency, setFrequency] = useState(365 * 9);
  const [formData, setFormData] = useState({
    Name: "",
    StartDate: "",
    EXP: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    id: "",
    Name: "",
    StartDate: "",
    EXP: "",
  });
  const [dataList, setDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewData, setViewData] = useState("Table"); // State to manage view
  const [loading, setLoading] = useState(false); // State to manage loading

  const componentRef = useRef(); // Create a reference

  const getFetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        "http://localhost:3001/UserInfo/SoftwareData"
      );
      const data = response.data.data;
      setDataList(data);
      filterData(data, frequency);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const filterData = (data, frequency) => {
    const days = parseInt(frequency, 10);
    const filtered = data.filter((item) => {
      const expDate = new Date(item.EXP);
      const today = new Date();
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });
    setFilteredData(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/UserInfo/SoftwareData/create",
        formData
      );
      setAddSection(false);
      getFetchData();
    } catch (error) {
      console.error("Error adding license:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3001/UserInfo/SoftwareData/update/${formDataEdit.id}`,
        formDataEdit
      );
      setEditSection(false);
      getFetchData();
    } catch (error) {
      console.error("Error updating license:", error);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditOnChange = (e) => {
    const { name, value } = e.target;
    setFormDataEdit({
      ...formDataEdit,
      [name]: value,
    });
  };

  const handleEdit = (record) => {
    setFormDataEdit({
      id: record._id,
      Name: record.Name,
      StartDate: record.StartDate.slice(0, 10), // Format date for input
      EXP: record.EXP.slice(0, 10), // Format date for input
    });
    setEditSection(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3001/UserInfo/SoftwareData/delete/${id}`
      );
      getFetchData();
    } catch (error) {
      console.error("Error deleting license:", error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  useEffect(() => {
    filterData(dataList, frequency);
  }, [frequency, dataList]);

  return (
    <>
      <div className="mx-48 w-28 mt-24 border-4 border-sky-500 bg-slate-400">
        {/* Icons to toggle between Table and Analytics view */}
        <UnorderedListOutlined
          className="mx-3 bg-teal-100 cursor-pointer"
          onClick={() => setViewData("Table")}
        />
        <AreaChartOutlined
          className="mx-3 bg-teal-300 cursor-pointer"
          onClick={() => setViewData("Analytics")}
        />
      </div>
      <div className="col-md-12 text-center mt-3">
        <ReactToPrint
          className=""
          trigger={() => (
            <button className="btn btn-primary bg-slate-700 w-14  text-2xl font-bold text-gray-900 dark:text-white">
              Print
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <div className="w-[70vw] mt-4 p-4 ml-44" ref={componentRef}>
        <h2 className="title">Software License Manager</h2>
        <Select
          value={frequency}
          onChange={(value) => setFrequency(value)}
          className="filter-select"
        >
          <Select.Option value={30}>A Month</Select.Option>
          <Select.Option value={15}>15 Days</Select.Option>
          <Select.Option value={10}>Less Than 10 Days</Select.Option>
          <Select.Option value={365}>A Year</Select.Option>
          <Select.Option value={365 * 9}>Till 9 Years</Select.Option>
        </Select>

        <Button
          onClick={() => setAddSection(!addSection)}
          className="add-button"
        >
          {addSection ? "Close" : "Add License"}
        </Button>

        {addSection && (
          <form
            onSubmit={handleSubmit}
            className="form m-2 w-[40vw] border border-solid border-indigo-600 rounded-lg"
          >
            <Input
              placeholder="Software Name"
              name="Name"
              value={formData.Name}
              onChange={handleOnChange}
            />
            <Input
              type="date"
              name="StartDate"
              value={formData.StartDate}
              onChange={handleOnChange}
            />
            <Input
              type="date"
              name="EXP"
              value={formData.EXP}
              onChange={handleOnChange}
            />
            <Button
              className="bg-blue-950 hover:bg-blue-700 text-semibold text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Add License
            </Button>
          </form>
        )}

        {editSection && (
          <form onSubmit={handleUpdate} className="form">
            <Input
              placeholder="Software Name"
              name="Name"
              value={formDataEdit.Name}
              onChange={handleEditOnChange}
            />
            <Input
              type="date"
              name="StartDate"
              value={formDataEdit.StartDate}
              onChange={handleEditOnChange}
            />
            <Input
              type="date"
              name="EXP"
              value={formDataEdit.EXP}
              onChange={handleEditOnChange}
            />
            <Button type="submit">Update License</Button>
          </form>
        )}

        {/* Conditionally Render Loader or Table/Analytics */}
        {loading ? (
          <div className="text-center mt-4">
            <Spin size="large" />
          </div>
        ) : viewData === "Table" ? (
          <Table
            dataSource={filteredData}
            columns={[
              {
                title: "Software Name",
                dataIndex: "Name",
                key: "Name",
              },
              {
                title: "Start Date",
                dataIndex: "StartDate",
                key: "StartDate",
              },
              {
                title: "Expiry Date",
                dataIndex: "EXP",
                key: "EXP",
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <>
                    <Button
                      className="m-3 p-2"
                      onClick={() => handleEdit(record)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="m-2"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </Button>
                  </>
                ),
              },
            ]}
            rowKey="_id"
          />
        ) : (
          <Analytics allSoftwareData={dataList} />
        )}
      </div>
    </>
  );
};

export default Home;
