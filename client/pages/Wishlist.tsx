import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";

interface WishlistItem {
  id: string;
  item: string;
  price: number;
  date: string;
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [salary, setSalary] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddOrEdit = async () => {
    if (!item || !price) return alert("Please enter both item and price");

    const payload = { item, price: parseFloat(price) };

    try {
      if (editId) {
        const res = await fetch(`/api/wishlist/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const updatedItem = await res.json();
        setWishlist(
          wishlist.map((entry) => (entry.id === updatedItem.id ? updatedItem : entry))
        );
        setEditId(null);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const newItem = await res.json();
        setWishlist([newItem, ...wishlist]);
      }

      setItem("");
      setPrice("");
    } catch (err) {
      console.error("Failed to save item", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(wishlist.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleEdit = (entry: WishlistItem) => {
    setItem(entry.item);
    setPrice(entry.price.toString());
    setEditId(entry.id);
  };

  const getSuggestions = (price: number | string) => {
    const numericPrice = typeof price === "number" ? price : parseFloat(price);

    const mutualFund1Yr = (numericPrice * 1.12).toFixed(0);
    const mutualFund3Yr = (numericPrice * Math.pow(1.12, 3)).toFixed(0);
    const mutualFund5Yr = (numericPrice * Math.pow(1.12, 5)).toFixed(0);

    const fd1Yr = (numericPrice * 1.07).toFixed(0);
    const sipMonthly = (numericPrice / 12).toFixed(0);

    const goldGrams = (numericPrice / 6500).toFixed(2);
    const appleShares = (numericPrice / 15000).toFixed(2);
    const ethCoins = (numericPrice / 250000).toFixed(4);

    return [
      {
        type: "Mutual Fund",
        suggestion: `Could grow to ₹${mutualFund1Yr} in 1yr, ₹${mutualFund3Yr} in 3yrs, ₹${mutualFund5Yr} in 5yrs (12% CAGR).`,
      },
      {
        type: "Fixed Deposit",
        suggestion: `Earn ₹${(parseFloat(fd1Yr) - numericPrice).toFixed(0)} in 1yr (7% interest).`,
      },
      {
        type: "SIP",
        suggestion: `Invest ₹${sipMonthly}/mo for a year instead.`,
      },
      {
        type: "Gold",
        suggestion: `Buy ≈ ${goldGrams}g of gold.`,
      },
      {
        type: "US Stocks",
        suggestion: `Buy ≈ ${appleShares} shares of Apple.`,
      },
      {
        type: "Crypto",
        suggestion: `Buy ≈ ${ethCoins} ETH.`,
      },
    ];
  };

  const getAffordability = (price: number) => {
    const monthly = parseFloat(salary);
    if (!monthly || monthly <= 0) return null;

    const ratio = price / monthly;
    if (ratio < 0.3) return "✅ Affordable (less than 30% of your monthly salary)";
    if (ratio < 0.6) return "⚠️ Caution: Moderate expense";
    return "🚨 Expensive: Consider saving more before buying";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Wishlist
        </h1>

        {/* Salary input */}
        <div className="mb-6">
          <label className="block mb-1 text-gray-800 dark:text-gray-200 font-medium">
            Your Monthly Salary (₹)
          </label>
          <input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            type="number"
            placeholder="e.g., 30000"
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {editId ? "Edit Item" : "Add a Future Purchase"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Item name"
              className="p-2 border rounded w-full"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Estimated price"
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            onClick={handleAddOrEdit}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            {editId ? "Update Item" : "Add to Wishlist"}
          </button>
        </div>

        {/* Wishlist Items */}
        {loading ? (
          <p className="text-center text-gray-500">Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No items yet. Start adding!</p>
        ) : (
          <div className="space-y-6">
            {wishlist.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {entry.item} – ₹{entry.price}
                    </h3>

                    {salary && (
                      <p className="text-sm mt-1 text-indigo-600 dark:text-indigo-300 font-medium">
                        {getAffordability(entry.price)}
                      </p>
                    )}

                    <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                      {getSuggestions(entry.price).map((s, i) => (
                        <li key={i}>
                          <strong>{s.type}:</strong> {s.suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
