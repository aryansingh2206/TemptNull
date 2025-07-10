import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import API from "@/lib/api";

export default function Tracker() {
  const [impulses, setImpulses] = useState<any[]>([]);
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("bought");
  const [regretRating, setRegretRating] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImpulses();
  }, []);

  const fetchImpulses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/impulses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImpulses((res.data as any[]).reverse());
    } catch (err) {
      console.error("❌ Failed to load impulses:", err);
    }
  };

  const handleAdd = async () => {
    if (!item || !price || !status) return alert("Fill all fields");

    const newEntry = {
      item,
      price: Number(price),
      status,
      regretRating: status === "bought" && regretRating ? Number(regretRating) : null,
      date: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await API.post("/impulses", newEntry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItem("");
      setPrice("");
      setStatus("bought");
      setRegretRating("");
      fetchImpulses();
    } catch (err) {
      console.error("❌ Failed to submit:", err);
      alert("Error adding entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
           Track a New Impulse
        </h1>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Item name"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={status}
              onChange={(e) => {
                const selected = e.target.value;
                setStatus(selected);
                if (selected === "skipped") setRegretRating(""); // clear regret on skip
              }}
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            >
              <option value="bought">Bought</option>
              <option value="skipped">Skipped</option>
            </select>

            {status === "bought" && (
              <input
                value={regretRating}
                onChange={(e) => setRegretRating(e.target.value)}
                type="number"
                min={1}
                max={10}
                placeholder="Regret Rating (1–10)"
                className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            )}

            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Add Entry"}
            </button>
          </div>

          {/* Past Entries */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
               Past Impulses
            </h2>
            {impulses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No entries yet.</p>
            ) : (
              <ul className="space-y-2">
                {impulses.map((entry, idx) => (
                  <li
                    key={idx}
                    className="border p-3 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  >
                    <strong>{entry.item}</strong> – ₹{entry.price} – {entry.status}
                    {entry.regretRating !== null && entry.regretRating !== undefined && (
                      <span className="text-sm text-gray-400">
                        {" "}
                        | Regret: {entry.regretRating}/10
                      </span>
                    )}
                    <div className="text-xs text-gray-400">
                      {entry.date
                        ? new Date(entry.date).toLocaleString()
                        : "No date"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
