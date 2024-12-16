import React, { useState, useMemo } from "react";
import itemsData from "../data/inventory.json";

function ItemsTable() {
  // We'll store the user’s search term here
  const [searchTerm, setSearchTerm] = useState("");

  // Keep track of which column is sorted, and in which direction
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handler for sorting when table headers are clicked
  const requestSort = (key) => {
    // If clicking the same column, flip direction; otherwise sort ascending
    setSortConfig((prevState) => {
      if (prevState.key === key) {
        return {
          key,
          direction: prevState.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  // Derived state: filter + sort
  const filteredAndSortedItems = useMemo(() => {
    const items = itemsData.items ?? [];

    // Filter items based on search term
    const filtered = items.filter((item) => {
      const lowerSearch = searchTerm.toLowerCase();
      // Check multiple fields if you want, e.g. name, owner, category
      return (
        item.name.toLowerCase().includes(lowerSearch) ||
        item.owner.toLowerCase().includes(lowerSearch) ||
        item.category.toLowerCase().includes(lowerSearch)
      );
    });

    // Sort the filtered items
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        // Sort numerically if possible, else lexically
        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else {
          // Convert to strings for lexical compare
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
          if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return filtered;
  }, [searchTerm, sortConfig]);

  return (
    <div className="p-4 w-full mx-auto">
      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table container (horizontal scroll on small devices) */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <TableHeader
                label="Name"
                sortKey="name"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              <TableHeader
                label="Quantity"
                sortKey="quantity"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              <TableHeader
                label="Owner"
                sortKey="owner"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              <TableHeader
                label="Category"
                sortKey="category"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              <TableHeader
                label="Value"
                sortKey="value"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              <TableHeader
                label="Weight"
                sortKey="weight"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              <TableHeader
                label="Rarity"
                sortKey="rarity"
                sortConfig={sortConfig}
                onClick={requestSort}
              />
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">{item.owner}</td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.value}</td>
                <td className="border px-4 py-2">{item.weight}</td>
                <td className="border px-4 py-2">{item.rarity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// A small helper component for table headers that shows clickable column titles
function TableHeader({ label, sortKey, sortConfig, onClick }) {
  // Determine an arrow indicator for the sorted column
  let arrow = "";
  if (sortConfig.key === sortKey) {
    arrow = sortConfig.direction === "asc" ? "▲" : "▼";
  }

  return (
    <th
      onClick={() => onClick(sortKey)}
      className="border px-4 py-2 cursor-pointer select-none"
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span>{arrow}</span>
      </div>
    </th>
  );
}

export default ItemsTable;
