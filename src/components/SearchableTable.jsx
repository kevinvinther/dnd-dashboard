import React, { useState, useMemo } from "react";

function SearchableTable({ data, columns }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const requestSort = (key) => {
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

  const filteredAndSortedItems = useMemo(() => {
    const items = data ?? [];

    const filtered = items.filter((item) => {
      const lowerSearch = searchTerm.toLowerCase();
      return columns.some((column) =>
        String(item[column.key]).toLowerCase().includes(lowerSearch)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else {
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
          if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return filtered;
  }, [searchTerm, sortConfig, data, columns]);

  return (
    <div className="p-4 w-full mx-auto">
      <div className="mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  label={column.label}
                  sortKey={column.key}
                  sortConfig={sortConfig}
                  onClick={requestSort}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="border px-4 py-2">
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHeader({ label, sortKey, sortConfig, onClick }) {
  let arrow = "";
  if (sortConfig.key === sortKey) {
    arrow = sortConfig.direction === "asc" ? " ⤴️" : " ⤵️ ";
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

export default SearchableTable;
