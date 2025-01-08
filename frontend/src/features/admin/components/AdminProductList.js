import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectAllProducts,
  fetchProductsByFiltersAsync,
  selectTotalItems,
  fetchBrandsAsync,
  fetchCategoriesAsync,
  selectBrands,
  selectCategories,
  selectProductListStatus,
  deleteCategoryAsync,
} from "../../product/productSlice";
import { ITEMS_PER_PAGE, discountedPrice } from "../../../app/constants";

import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../common/Pagination";
import { Grid, Oval } from "react-loader-spinner";
import ".././admin.css";
// WILL CHANGE LATER

const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  { name: "Price: Low to High", sort: "price", order: "asc", current: false },
  { name: "Price: High to Low", sort: "-price", order: "desc", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AdminProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);
  const totalItems = useSelector(selectTotalItems);
  console.log("Total items are: ", totalItems);

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [page, setPage] = useState(1);
  const status = useSelector(selectProductListStatus);

  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
  ];

  const editForm = (id) => {
    console.log(id);
    navigate(`/admin/category-form/edit/${id}`);
  };

  const deleteForm = (id) => {
    console.log(id);
    dispatch(deleteCategoryAsync(id));
    dispatch(fetchCategoriesAsync());
  };

  const handleFilter = (e, section, option) => {
    // console.log(section.id, option.value);
    // section.id
    // const newFilter = { ...filter, [section.id]: option.value };
    // setFilter(newFilter);
    // dispatch(fetchProductsByFiltersAsync(newFilter));

    console.log(e.target.checked);
    const newFilter = { ...filter };

    // TODO : on server it will support multiple categories -> Iske lia push use kre gy as aik array jaisa format bana ga

    if (e.target.checked) {
      // if section.id phely sy bana huwa ya koi filter huwa wa phely sy
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        // pheli baar hurha tw array bana do array bhi banana huga

        newFilter[section.id] = [option.value];
      }
    } else {
      // hatana wala case phely find krlo and delete krdo splice jo unchecked kia
      const index = newFilter[section.id].findIndex(
        (el) => el === option.value
      );
      newFilter[section.id].splice(index, 1);
    }
    console.log({ newFilter });

    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order }; //sorting on behalf of regular price not on discount price
    console.log({ sort }); // sab mil rha in object form
    setSort(sort);
  };

  const handlePage = (page) => {
    console.log({ page });
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    // dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }));
    dispatch(
      fetchProductsByFiltersAsync({ filter, sort, pagination, admin: true })
    );
  }, [dispatch, filter, sort, page]);

  // useEffect(() => {
  //   dispatch(fetchAllProductsAsync());
  // }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, []);

  return (
    <div>
      <div>
        <div className="bg-white">
          <div>
            {/* Mobile filter dialog */}
            <MobileFilter
              handleFilter={handleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              filters={filters}
              editForm={editForm}
              deleteForm={deleteForm}
            ></MobileFilter>

            {/* Main section */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  All Products
                </h1>

                <div className="flex items-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        Sort
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                              {({ active }) => (
                                <p
                                  onClick={(e) => handleSort(e, option)}
                                  className={classNames(
                                    option.current
                                      ? "font-medium text-gray-900"
                                      : "text-gray-500",
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  {option.name}
                                </p>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <button
                    type="button"
                    className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
                  >
                    <span className="sr-only">View grid</span>
                    <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <span className="sr-only">Filters</span>
                    <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <section
                aria-labelledby="products-heading"
                className="pb-24 pt-6"
              >
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>

                {/* Main section end */}

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  {/*Desktop Filters */}
                  <DesktopFilter
                    handleFilter={handleFilter}
                    filters={filters}
                    editForm={editForm}
                    deleteForm={deleteForm}
                  ></DesktopFilter>

                  {/* Product grid */}
                  <div className="lg:col-span-3">
                    {/* Add button */}
                    <div style={{ display: "flex" }}>
                      <div>
                        <Link
                          to="/admin/product-form"
                          className="rounded-md mx-10 my-5 bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Add New Product
                        </Link>
                      </div>

                      <div>
                        <Link
                          to="/admin/category-form"
                          className="rounded-md my-5 bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Add New Category
                        </Link>
                      </div>
                    </div>

                    {/* This is our products list  */}
                    <ProductGrid
                      products={products}
                      status={status}
                    ></ProductGrid>
                  </div>
                  {/*  Product grid end */}
                </div>
              </section>

              {/* Pagination */}
              <Pagination
                page={page}
                setPage={setPage}
                handlePage={handlePage}
                totalItems={totalItems}
              ></Pagination>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductList;

function MobileFilter({
  handleFilter,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  editForm,
  deleteForm,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                                <div className="editdlticon">
                                  <label
                                    className="ml-3 text-sm text-gray-600"
                                    onClick={() => editForm(option.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-4"
                                      color="green"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                      />
                                    </svg>
                                  </label>
                                  <label
                                    className="ml-3 text-sm text-gray-600"
                                    onClick={() => deleteForm(option.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4"
                                      color="red"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters, editForm, deleteForm }) {
  return (
    <form className="hidden lg:block">
      <h3 className="sr-only">Categories</h3>

      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div>
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={(e) => handleFilter(e, section, option)}
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>

                      <div className="editdlticon">
                        <label
                          className="ml-3 text-sm text-gray-600"
                          onClick={() => editForm(option.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                            color="green"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                          </svg>
                        </label>
                        <label
                          className="ml-3 text-sm text-gray-600"
                          onClick={() => deleteForm(option.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-4"
                            color="red"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}

function ProductGrid({ products, status }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {status === "loading" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Oval
                height="80"
                width="80"
                color="rgb(79, 70, 229)"
                secondaryColor="rgb(79, 70, 229)"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            <>
              {products.map((product) => (
                <div>
                  <Link to={`/product-detail/${product.id}`} key={product.id}>
                    {/* Border */}
                    <div className="group relative border-solid border-2 p-2 border-gray-200">
                      <div className="min-h-60 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                        />
                      </div>

                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                            <div href={product.thumbnail}>
                              <span
                                aria-hidden="true"
                                className="absolute inset-0"
                              />
                              {product.title}
                            </div>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            <StarIcon className="w-6 h-6 inline"></StarIcon>
                            <span className=" align-bottom">
                              {product.rating}
                            </span>
                          </p>
                        </div>
                        <div>
                          {product.discountPercentage > 0 ? (
                            <>
                              <p className="text-sm block font-medium text-gray-900">
                                $
                                {Math.round(
                                  product.price *
                                    (1 - product.discountPercentage / 100)
                                )}
                              </p>
                              <p className="text-sm block line-through font-medium text-gray-400">
                                ${product.price}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm block font-medium text-gray-900">
                              ${product.price}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* RATINGS NAME DONE */}
                      {product.deleted && (
                        <div>
                          <p className="text-sm text-red-400">
                            product deleted
                          </p>
                        </div>
                      )}

                      {product.stock <= 0 && (
                        <div>
                          <p className="text-sm text-red-400">out of stock</p>
                        </div>
                      )}
                    </div>
                  </Link>
                  {/* Edit button */}
                  <div className="mt-5">
                    <Link
                      to={`/admin/product-form/edit/${product.id}`}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Edit Product
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
