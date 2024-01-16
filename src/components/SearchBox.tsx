import React, { useState, useRef, useEffect } from "react";
import "./SearchBox.css";

const SearchBox = () => {
  const items = [
    "New Delhi",
    "Haryana",
    "Telegana",
    "Karnataka",
    "Himachal Pradesh",
  ];

  const imageUrls: { [key: string]: string } = {
    "New Delhi":
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Haryana:
      "https://images.unsplash.com/photo-1605469237567-a39930679526?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Telegana:
      "https://images.unsplash.com/photo-1699636250199-2a6998981619?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Karnataka:
      "https://images.unsplash.com/photo-1631714712922-eaa39e4452fa?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Himachal Pradesh":
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [remainingSuggestions, setRemainingSuggestions] =
    useState<string[]>(items);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputPosition, setInputPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleBackspace = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && inputValue === "") {
        const lastChip = selectedItems[selectedItems.length - 1];

        if (!highlightedItem && lastChip) {
          // If no chip is highlighted, highlight the last chip
          setHighlightedItem(lastChip);
        } else if (highlightedItem === lastChip) {
          // If the last chip is highlighted, remove it
          handleChipRemove(lastChip);
          setHighlightedItem(null); // Clear the highlighted item
        }
      }
    };

    document.addEventListener("keydown", handleBackspace);

    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, [inputValue, selectedItems, highlightedItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const filteredSuggestions = remainingSuggestions.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setRemainingSuggestions(filteredSuggestions);
  };

  const handleInputClick = () => {
    const inputElement = inputRef.current;

    if (inputElement) {
      const inputRect = inputElement.getBoundingClientRect();
      setInputPosition({ top: inputRect.bottom, left: inputRect.left });
    }

    setShowSuggestions(true);
    setRemainingSuggestions(
      items.filter((item) => !selectedItems.includes(item))
    );
  };

  const handleItemClick = (item: string) => {
    setInputValue("");
    setSelectedItems([...selectedItems, item]);
    setShowSuggestions(false);
    setHighlightedItem(null);
  };

  const handleChipRemove = (item: string) => {
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    setSelectedItems(updatedItems);

    setRemainingSuggestions((prevSuggestions) => {
      if (!prevSuggestions.includes(item)) {
        return [...prevSuggestions, item]; // Add the removed item back to the suggestions
      }
      return prevSuggestions;
    });

    const inputElement = inputRef.current;

    if (inputElement) {
      const inputRect = inputElement.getBoundingClientRect();
      setInputPosition({ top: inputRect.bottom, left: inputRect.left });
    }

    const lastRemainingItem =
      remainingSuggestions[remainingSuggestions.length - 1];
    setHighlightedItem(lastRemainingItem);
  };

  return (
    <div>
      <h2 className="header">Select all the states</h2>

      <div
        style={{
          position: "relative",
          borderRadius: "4px",
          padding: "8px",
          display: "inline-block",
          borderBottom: "3px solid #82b7df",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            paddingLeft: "8px",
          }}
        >
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className={`chip ${
                highlightedItem === item ? "highlighted" : ""
              }`}
              style={{
                borderBottom:
                  highlightedItem === item ? "none" : "2px solid white",
              }}
            >
              <img
                src={imageUrls[item]} // Use the corresponding image URL for each item
                alt={`Image for ${item}`}
                className="round-image"
              />
              {item}
              <button
                onClick={() => handleChipRemove(item)}
                className="remove-btn"
              >
                X
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            placeholder={selectedItems.length > 0 ? "" : "Search..."}
            style={{
              flex: "1" /* Allow the input to take up available space */,
              minWidth: "100px" /* Set a minimum width for the input */,
              maxWidth: "300px" /* Set a maximum width for the input */,
              border: "none",
              outline: "none",
              width: "100%" /* Set width to 100% to span the full length */,
              height: "30px" /* Set a fixed height */,
            }}
          />
        </div>
        {showSuggestions && remainingSuggestions.length > 0 && (
          <div
            style={{
              position: "fixed", // Use fixed position for accurate placement
              top: inputPosition ? inputPosition.top : "auto",
              left: inputPosition ? inputPosition.left : "auto",
              width: "15%",
              maxHeight: "150px",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: 1,
            }}
          >
            <ul style={{ listStyle: "none", padding: 0 }}>
              {remainingSuggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(item)}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    backgroundColor:
                      highlightedItem === item ? "#c1e4fe" : "#f4f4f4",
                    borderRadius: "4px",
                    margin: "4px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={imageUrls[item]} // Use the corresponding image URL for each item
                    alt={`Image for ${item}`}
                    className="round-image"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchBox;
