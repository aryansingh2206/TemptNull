import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { fetchWithToken } from "@/utils/fetchWithToken";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const data = await fetchWithToken("/api/badges");
        if (Array.isArray(data)) {
          setBadges(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        console.error("Failed to fetch badges:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Achievement Badges
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your progress and celebrate your financial discipline milestones.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading badges...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : badges.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No badges unlocked yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 transition-all ${
                  badge.unlocked
                    ? "border-gray-100 dark:border-gray-700 hover:shadow-md"
                    : "border-gray-200 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${
                      badge.unlocked
                        ? "bg-gradient-to-r from-teal-100 to-indigo-100"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {badge.unlocked ? badge.icon : "🔒"}
                  </div>
                  <h3
                    className={`font-semibold mb-2 ${
                      badge.unlocked
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {badge.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      badge.unlocked
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {badge.description}
                  </p>
                  {badge.unlocked && (
                    <div className="mt-4">
                      <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Unlocked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
