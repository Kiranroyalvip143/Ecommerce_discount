import React, { useEffect, useState } from "react";
import "./ProductPicker.css";

const ProductPicker = ({ isOpen, onClose, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (search = "", currentPage = 1) => {
    try {
      const response = await fetch(
        `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${currentPage}&limit=10`,
        {
          headers: {
            "x-api-key": "72njgfa948d9aS7gs5",
          },
        }
      );
      const data = await response.json();
      if (data.length < 10) setHasMore(false);
      setProducts((prev) => (currentPage === 1 ? data : [...prev, ...data]));
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts(searchTerm, page);
    }
  }, [isOpen, searchTerm, page]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const handleItemSelect = (
    id,
    isVariant = false,
    productId = null,
    title = ""
  ) => {
    setSelectedItems((prev) => {
      let updatedSelection = [...prev];

      if (isVariant) {
        // Handle variant selection
        const product = products.find((product) => product.id === productId);
        const existingProductIndex = updatedSelection.findIndex(
          (item) => item.id === productId
        );

        if (existingProductIndex === -1) {
          // If the parent product isn't in the selection, add it with the selected variant
          updatedSelection.push({
            ...product,
            variants: product.variants.filter((variant) => variant.id === id),
          });
        } else {
          // If the parent product exists, replace its variants with the selected one
          updatedSelection[existingProductIndex] = {
            ...product,
            variants: product.variants.filter((variant) => variant.id === id),
          };
        }
      } else {
        // Handle product selection
        const product = products.find((product) => product.id === id);
        const productSelected = updatedSelection.some((item) => item.id === id);

        if (productSelected) {
          // Deselect product and all its variants
          updatedSelection = updatedSelection.filter((item) => item.id !== id);
        } else {
          // Select the product with all its variants
          updatedSelection.push({ ...product });
        }
      }

      return updatedSelection;
    });
  };

  const handleAdd = () => {
    onAdd(selectedItems);
    onClose();
  };

  return (
    isOpen && (
      <div className="product-picker-modal">
        <div className="product-picker">
          <div className="product-header">
            <h3>Select Products</h3>
            <button onClick={onClose} className="close-button">
              ×
            </button>
          </div>
          <input
            type="text"
            placeholder="Search product"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          <div
            className="product-list"
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.target;
              if (scrollHeight - scrollTop === clientHeight && hasMore) {
                setPage((prev) => prev + 1);
              }
            }}
          >
            {products.map((product) => (
              <div key={product.id}>
                <div className="product-row">
                  <input
                    type="checkbox"
                    onChange={() => handleItemSelect(product.id, false)}
                    checked={selectedItems.some(
                      (item) => item.id === product.id && !item.isVariant
                    )}
                  />
                  <img
                    src={product.image.src}
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="product-details">
                    <span className="product-title">{product.title}</span>
                  </div>
                  <span className="product-price">${product.price}</span>
                </div>
                {product.variants.map((variant) => (
                  <div key={variant.id} className="product-row">
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleItemSelect(variant.id, true, product.id)
                      }
                      checked={selectedItems.some(
                        (item) => item.id === variant.id && item.isVariant
                      )}
                    />
                    <div className="product-details">
                      <span>{variant.title}</span>
                      <span className="variant-availability">
                        {variant.inventory_quantity} available
                      </span>
                    </div>
                    <span className="variant-price">${variant.price}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="footer">
            <span>{selectedItems.length} item(s) selected</span>
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleAdd} className="add-button">
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductPicker;
