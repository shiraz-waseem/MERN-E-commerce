import React, { useEffect, useState } from "react";
import { ITEMS_PER_PAGE, discountedPrice } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";

const AdminOrders = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [sort, setSort] = useState({});

  // console.log("Orders are: ", orders);

  const [editableOrderId, setEditableOrderId] = useState(-1);

  const handleUpdate = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handleShow = () => {
    console.log("handleShow");
  };

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (value) => {
    console.log("Value of sort is: ", sort); // shru mein empty tw woh not equal arrow up le ata then arrow down as braber hujati phir
    setSort(value);
  };
  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  // Product page sy
  // _per_page ana thaa
  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ pagination, sort }));
  }, [dispatch, page, sort]);

  return (
    <div className="overflow-x-auto">
      <div className=" bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
        <div className="w-full">
          total Orders : {totalOrders}
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Order# </th>
                  <th className="py-3 px-6 text-left">Items</th>
                  <th className="py-3 px-6 text-center md:table-cell">
                    Total Amount{" "}
                    {
                      <>
                        {sort?._sort !== "totalAmount" ? (
                          <ArrowUpCircleIcon
                            className="w-6 h-6 ml-1 inline cursor-pointer"
                            onClick={(e) =>
                              handleSort({ _sort: "totalAmount" })
                            }
                          />
                        ) : (
                          <ArrowDownCircleIcon
                            className="w-6 h-6 ml-1 inline  cursor-pointer"
                            onClick={(e) =>
                              handleSort({ _sort: "-totalAmount" })
                            }
                          />
                        )}
                      </>
                    }{" "}
                  </th>
                  <th className="py-3 px-6 text-center">Shipping Address</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {orders &&
                  orders.map((order) => (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      {/* Order Id */}
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2"></div>
                          <span className="font-medium">{order.id}</span>
                        </div>
                      </td>
                      {/* Order items */}
                      <td className="py-3 px-6 text-left">
                        {order.items.map((item) => (
                          <div className="flex items-center">
                            <div className="mr-2">
                              <img
                                className="w-6 h-6 rounded-full"
                                src={item.product.thumbnail}
                              />
                            </div>
                            <span>
                              {" "}
                              {item.product.title} - #{item.quantity} - $
                              {discountedPrice(item)}
                            </span>
                          </div>
                        ))}
                      </td>
                      {/* Total Amount */}
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center justify-center">
                          {/* {discountedPrice} */}${order.totalAmount}
                        </div>
                      </td>
                      {/* Address */}
                      <td className="py-3 px-6 text-center">
                        <div className="">
                          <div>
                            <strong>{order.selectedAddress.name}</strong>,
                          </div>
                          <div>{order.selectedAddress.street},</div>
                          <div>{order.selectedAddress.city}, </div>
                          <div>{order.selectedAddress.state}, </div>
                          <div>{order.selectedAddress.pinCode}, </div>
                          <div>{order.selectedAddress.phone}, </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-6 text-center">
                        {order.id === editableOrderId ? (
                          <select onChange={(e) => handleUpdate(e, order)}>
                            <option value="pending">Pending</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`${chooseColor(
                              order.status
                            )} py-1 px-3 rounded-full text-xs`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <div className="w-6 mr-4 transform hover:text-purple-500 hover:scale-110">
                            <EyeIcon
                              className="w-7 h-7"
                              onClick={(e) => handleShow(order)}
                            ></EyeIcon>
                          </div>
                          <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <PencilIcon
                              className="w-7 h-7"
                              onClick={(e) => handleEdit(order)}
                            ></PencilIcon>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        handlePage={handlePage}
        totalItems={totalOrders}
      ></Pagination>
    </div>
  );
};

export default AdminOrders;
