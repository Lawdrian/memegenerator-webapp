import React from 'react';

function SortingFilteringComponent({ onSortChange, onFilterChange }) {
  return (
    <div>
      <div>
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" onChange={(e) => onSortChange(e.target.value)}>
          <option value="">No Sorting</option>
          <option value="mostLikes">Most Likes</option>
          <option value="leastLikes">Least Likes</option>
          <option value="newest">Latest Creation Date</option>
          <option value="oldest">Oldest Creation Date</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-by">Filter by</label>
        <input
          type="number"
          id="filter-by"
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Enter minimum votes/views"
        />
      </div>
    </div>
  );
}

export default SortingFilteringComponent;
