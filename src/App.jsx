import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );

  const owner = usersFromServer.find(user => user.id === category.ownerId);

  return {
    ...product,
    category,
    owner,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filterProductsByUser = userId => {
    if (userId === 'all') {
      return products;
    }

    return products.filter(product => product.owner.id === userId);
  };

  const filterProductsBySearch = () => {
    if (!searchText) {
      return products;
    }

    return products.filter(product =>
      product.name.toLowerCase().includes(searchText),
    );
  };

  const filterProductsByOwner = userId => {
    if (userId === 'all') {
      return products;
    }

    return products.filter(product => product.owner.id === userId);
  };

  const handleUserFilterChange = userId => {
    setSelectedUserId(userId);
  };

  const filteredProductsByOwner = filterProductsByOwner(selectedUserId);

  const filteredProducts = filterProductsBySearch(
    filterProductsByUser(selectedUserId),
  );

  const handleSearchChange = event => {
    setSearchText(event.target.value.toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleResetFilters = () => {
    setSelectedUserId('all');
    setSearchText('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === 'all' ? 'is-active' : ''}
                onClick={() => handleUserFilterChange('all')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy={`FilterUser-${user.name}`}
                  href="#/"
                  onClick={() => handleUserFilterChange(user.id)}
                  className={selectedUserId === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchText}
                  onChange={handleSearchChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchText && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  className="button mr-2 my-1"
                >
                  {category.icon} {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProductsByOwner.length > 0 ? (
                  filteredProductsByOwner.map(product => (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>

                      <td data-cy="ProductCategory">
                        <span>
                          {product.category.icon} - {product.category.title}
                        </span>
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={
                          product.owner.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                      >
                        {product.owner.name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="has-text-centered">
                      No products matching selected criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
