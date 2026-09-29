import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

export default function RecentTransactions({
  transactions,
  accounts,
  currentPage,
  setCurrentPage,
  filter,
  setFilter,
}) {

  const getStatus = (status) => {
    switch (status) {

      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
            <CheckCircle2 size={14} />
            Success
          </span>
        );

      case "PENDING":
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
            <Clock3 size={14} />
            Pending
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
            <XCircle size={14} />
            Failed
          </span>
        );

    }
  };

  const transactionsPerPage = 5;

  const filteredTransactions =
    filter === "ALL"
      ? transactions
      : transactions.filter(
        (item) => item.status === filter
      );

  const indexOfLast =
    currentPage * transactionsPerPage;

  const indexOfFirst =
    indexOfLast - transactionsPerPage;

  const currentTransactions =
    filteredTransactions.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages = Math.ceil(
    filteredTransactions.length /
    transactionsPerPage
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          Recent Transactions
        </h2>

        <div className="flex items-center gap-3">

          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white"
          >
            <option value="ALL">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-white/10 text-left text-gray-400">

              <th className="pb-4">Account</th>
              <th className="pb-4">Type</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Date</th>

            </tr>

          </thead>

          <tbody>

            {currentTransactions.map((item) => {

              const isDebit = accounts.some(
                (acc) => acc._id === item.fromAccount._id
              );

              return (

                <tr
                  key={item._id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >

                  <td className="py-5 font-medium text-white">
                    {isDebit
                      ? item.toAccount.accountNumber
                      : item.fromAccount.accountNumber}
                  </td>

                  <td>

                    <div
                      className={`flex items-center gap-2 ${isDebit
                        ? "text-red-400"
                        : "text-emerald-400"
                        }`}
                    >

                      {isDebit ? (
                        <ArrowUpRight size={18} />
                      ) : (
                        <ArrowDownLeft size={18} />
                      )}

                      {isDebit ? "Debit" : "Credit"}

                    </div>

                  </td>

                  <td
                    className={`font-semibold ${isDebit
                      ? "text-red-400"
                      : "text-emerald-400"
                      }`}
                  >
                    {isDebit ? "-" : "+"}₹
                    {Number(item.amount).toLocaleString("en-IN")}
                  </td>

                  <td>
                    {getStatus(item.status)}
                  </td>

                  <td className="text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

        <div className="mt-8 flex items-center justify-center gap-4">

          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-white font-medium">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </section>
  );
}