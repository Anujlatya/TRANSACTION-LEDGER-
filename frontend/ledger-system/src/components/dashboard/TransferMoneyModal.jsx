import { useState } from "react";
import { X } from "lucide-react";
import { transferMoney } from "../../services/transactionService";
import { searchAccount } from "../../services/accountService";

export default function TransferMoneyModal({
  isOpen,
  onClose,
  accounts,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    if (!formData.toAccount) {
      alert("Enter Account Number");
      return;
    }

    try {
      setSearching(true);

      const res = await searchAccount(formData.toAccount);

      setReceiver(res.data.account);

    } catch (error) {
      setReceiver(null);

      alert(
        error.response?.data?.message || "Account Not Found"
      );
    } finally {
      setSearching(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await transferMoney({
        fromAccount: formData.fromAccount,
        toAccount: receiver._id,
        amount: Number(formData.amount),
        idempotencyKey: crypto.randomUUID(),
      });

      alert("Transaction Successful");

      setFormData({
        fromAccount: "",
        toAccount: "",
        amount: "",
      });

      setReceiver(null);

      onSuccess();

      onClose();

    } catch (error) {
      alert(error.response?.data?.message || "Transfer Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-[#0f172a] p-8">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Transfer Money
          </h2>

          <button onClick={onClose}>
            <X className="text-white" />
          </button>

        </div>

        <form
          onSubmit={handleTransfer}
          className="space-y-5"
        >

          <select
            name="fromAccount"
            value={formData.fromAccount}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 p-3 text-white"
            required
          >
            <option value="">Select Sender Account</option>

            {accounts.map((account) => (
              <option
                key={account._id}
                value={account._id}
              >
                {account.bankName}
              </option>
            ))}

          </select>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Receiver Account Number
            </label>

            <input
              type="text"
              name="toAccount"
              value={formData.toAccount}
              onChange={handleChange}
              placeholder="Enter Account Number"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="mt-3 rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black hover:bg-cyan-400"
            >
              {searching ? "Searching..." : "Search Account"}
            </button>

            {receiver && (
              <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">

                <p className="text-lg font-semibold text-white">
                  {receiver.accountHolder}
                </p>

                <p className="text-sm text-gray-300">
                  Account No : {receiver.accountNumber}
                </p>

                <p className="text-green-400">
                  Status : {receiver.status}
                </p>

              </div>
            )}
          </div>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/10 p-3 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black hover:bg-cyan-400"
          >
            {loading ? "Processing..." : "Transfer Money"}
          </button>

        </form>

      </div>

    </div>
  );
}