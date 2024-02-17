import React from "react";

function SortingFilteringComponent({ onSortChange, onFilterChange }) {
  return (
    <div>
      <div>
        <label>Sort by:</label>
        <select onChange={(e) => onSortChange(e.target.value)}>
          <option value="mostLikes">Most Likes</option>
          <option value="leastLikes">Least Likes</option>
          <option value="newest">Latest Creation Date</option>
          <option value="oldest">Oldest Creation Date</option>
        </select>
      </div>
      <div>
        <label>Filter by votes/views:</label>
        <input
          type="number"
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Enter minimum votes/views"
        />
      </div>
    </div>
  );
}

export default SortingFilteringComponent;
