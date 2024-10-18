import React from "react";

const AdminList = () => {
  const admins = [
    {
      admin_id: 1,
      name: "Abdikhafar Issack",
      email: "abdikhafar@hospital.com",
    },
    { admin_id: 2, name: "Amos Mokua", email: "amos@hospital.com" },
    { admin_id: 3, name: "Cliff Johnson", email: "cliff@hospital.com" },
    { admin_id: 4, name: "Mark Maina", email: "mark@hospital.com" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin List</h2>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">Name</th>
            <th className="border-b p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.admin_id} className="hover:bg-gray-100">
              <td className="border-b p-4">{admin.name}</td>
              <td className="border-b p-4">{admin.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
