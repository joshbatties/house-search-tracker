
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    interested: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    viewed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    applied: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
};
