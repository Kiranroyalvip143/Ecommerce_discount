import React, { useEffect, useState, useRef, useCallback } from "react";
import "./ProductPicker.css";

const ProductPicker = ({ isOpen, onClose, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

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

  const handleItemSelect = (id, isVariant = false, productId = null) => {
    setSelectedItems((prev) => {
      let updatedSelection = [...prev];

      if (isVariant) {
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
          // If the parent product exists, update its variants
          const existingProduct = updatedSelection[existingProductIndex];
          const variantSelected = existingProduct.variants.some(
            (variant) => variant.id === id
          );

          if (variantSelected) {
            // Deselect the variant
            existingProduct.variants = existingProduct.variants.filter(
              (variant) => variant.id !== id
            );
            if (existingProduct.variants.length === 0) {
              // If no variants are left, remove the product
              updatedSelection = updatedSelection.filter(
                (item) => item.id !== productId
              );
            } else {
              updatedSelection[existingProductIndex] = existingProduct;
            }
          } else {
            // Select the variant
            existingProduct.variants.push(
              product.variants.find((variant) => variant.id === id)
            );
            updatedSelection[existingProductIndex] = existingProduct;
          }
        }
      } else {
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

  const lastProductElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

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
          <div className="product-list">
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={
                  products.length === index + 1 ? lastProductElementRef : null
                }
              >
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
                        (item) =>
                          item.id === product.id &&
                          item.variants.some((v) => v.id === variant.id)
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
