import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, Button, Input, Select, Spin, Modal } from "antd";
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
  const [viewData, setViewData] = useState("Table");
  const [loading, setLoading] = useState(false);

  const componentRef = useRef();

  const getFetchData = async () => {
    setLoading(true);
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
      setLoading(false);
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
      StartDate: record.StartDate.slice(0, 10),
      EXP: record.EXP.slice(0, 10),
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
      <h2 className="mt-32 ml-[35vw] p-2 text-black-900 mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-3xl lg:text-3xl dark:text-yellow">
        Software License Manager
      </h2>
      <div className=" w-[54vw] wrap flex  mx-52  rounded-lg ">
        <UnorderedListOutlined
          className=" bg-teal-100 cursor-pointer"
          onClick={() => setViewData("Table")}
        />
        <AreaChartOutlined
          className="mx-3 w-5 bg-teal-300 cursor-pointer"
          onClick={() => setViewData("Analytics")}
        />
        <div className="flex ml-[100%] text-center ">
          <ReactToPrint
            className=""
            trigger={() => (
              <button className=" btn btn-primary bg-slate-700 text-2xl font-bold text-gray-900 dark:text-white rounded-lg hover:bg-slate-900 w-22 p-2">
                Print
              </button>
            )}
            content={() => componentRef.current}
          />
        </div>
      </div>
      <div className="w-[70vw] mt-4 p-4 ml-44" ref={componentRef}>
        <Select
          className="w-52 text-sm font-medium text-gray-900 dark:text-white"
          value={frequency}
          onChange={(value) => setFrequency(value)}
        >
          <Select.Option
            value={10}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            Less Than 10 Days
          </Select.Option>
          <Select.Option
            value={15}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            15 Days
          </Select.Option>
          <Select.Option
            value={30}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            A Month
          </Select.Option>
          <Select.Option
            value={365}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            A Year
          </Select.Option>
          <Select.Option
            value={365 * 10}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            Till 10 Years
          </Select.Option>
        </Select>

        <Button
          onClick={() => setAddSection(true)}
          className="m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add License
        </Button>

        {/* Add License Modal */}
        <Modal
          title="Add License"
          visible={addSection}
          onOk={handleSubmit}
          onCancel={() => setAddSection(false)}
        >
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Software Name"
              name="Name"
              className="mb-2"
              value={formData.Name}
              onChange={handleOnChange}
            />
            <Input
              type="date"
              name="StartDate"
              className="mb-2"
              value={formData.StartDate}
              onChange={handleOnChange}
            />
            <Input
              type="date"
              name="EXP"
              className="mb-2"
              value={formData.EXP}
              onChange={handleOnChange}
            />
          </form>
        </Modal>

        {/* Edit License Modal */}
        <Modal
          title="Edit License"
          visible={editSection}
          onOk={handleUpdate}
          onCancel={() => setEditSection(false)}
        >
          <form onSubmit={handleUpdate}>
            <Input
              placeholder="Software Name"
              name="Name"
              className="mb-2"
              value={formDataEdit.Name}
              onChange={handleEditOnChange}
            />
            <Input
              type="date"
              name="StartDate"
              className="mb-2"
              value={formDataEdit.StartDate}
              onChange={handleEditOnChange}
            />
            <Input
              type="date"
              name="EXP"
              className="mb-2"
              value={formDataEdit.EXP}
              onChange={handleEditOnChange}
            />
          </form>
        </Modal>

        {/* Conditionally Render Loader or Table/Analytics */}
        {loading ? (
          <div className="bg-zinc-500">
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
