import React, { useContext } from 'react'
import { AdminAuthContext } from '../Context/AdminAuthContext';
import AdminLayout from './AdminCommon/AdminLayout';
import { Link } from 'react-router-dom';

export default function Dashboard() {
 const stats = [
    { title: "Users", value: 12, href: "/admin/users" },
    { title: "Orders", value: 5, href: "/admin/orders" },
    { title: "Products", value: 42, href: "/admin/products" },
  ];

  const recent = [
    { id: "ORD-1005", customer: "Ankit Verma", total: "₹2,499", status: "Paid", date: "23 Aug" },
    { id: "ORD-1004", customer: "Riya Singh", total: "₹1,299", status: "Pending", date: "22 Aug" },
    { id: "ORD-1003", customer: "Aman Gupta", total: "₹5,050", status: "Paid", date: "21 Aug" },
  ];
    return (
    <div>
        <AdminLayout>
             <div className="p-6 space-y-6">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
        <Link
          to="/admin/orders"
          className="text-sm px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          View all orders
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s) => (
          <Link
            key={s.title}
            to={s.href}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.title}</div>
            <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
            <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400">View {s.title.toLowerCase()} →</div>
          </Link>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Order ID</th>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Total</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr
                    key={r.id}
                    className={i % 2 ? "bg-white dark:bg-gray-800" : "bg-gray-50/60 dark:bg-gray-900/30"}
                  >
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{r.id}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-200">{r.customer}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-200">{r.total}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          r.status === "Paid"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder chart / summary */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Sales Snapshot
          </h2>
          <div className="h-40 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
            (Add a chart later)
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li className="flex justify-between"><span>Today</span><span>₹1,250</span></li>
            <li className="flex justify-between"><span>This week</span><span>₹9,800</span></li>
            <li className="flex justify-between"><span>This month</span><span>₹41,320</span></li>
          </ul>
        </div>
      </div>
    </div>  
        </AdminLayout>
    </div>
  )
}
