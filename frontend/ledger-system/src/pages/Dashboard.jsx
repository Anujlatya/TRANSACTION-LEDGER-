import { useState, useEffect } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import AccountCard from "../components/dashboard/AccountCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import QuickActions from "../components/dashboard/QuickActions";
import StatCard from "../components/dashboard/StatCard";
import CreateAccountModal from "../components/dashboard/CreateAccountModal";
import TransferMoneyModal from "../components/dashboard/TransferMoneyModal";
import { getTransactions } from "../services/transactionService";

import {
  Wallet,
  Landmark,
  ArrowLeftRight,
  Clock3,
} from "lucide-react";

import {
  getAccounts,
  getAccountBalance,
} from "../services/accountService";

export default function Dashboard() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("ALL");

  const bankNames = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
  ];

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      const rawTx = res.data?.data?.transactions || res.data?.transactions || res.data?.data || res.data || [];
      setTransactions(Array.isArray(rawTx) ? rawTx : []);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await getAccounts();
      const rawAcc = res.data?.data?.accounts || res.data?.accounts || res.data?.data || res.data || [];
      const accountsData = Array.isArray(rawAcc) ? rawAcc : [];

      const finalAccounts = await Promise.all(
        accountsData.map(async (account, index) => {
          let balance = 0;
          try {
            const balanceRes = await getAccountBalance(account._id);
            balance = balanceRes.data?.data?.balance ?? balanceRes.data?.balance ?? 0;
          } catch (err) {
            console.log("Error fetching balance:", err);
          }

          return {
            ...account,
            balance,
            bankName: bankNames[index % bankNames.length],
            accountType: "Savings Account",
            accountNumber: account.accountNumber || `XXXX XXXX ${1000 + index * 1234}`,
            color:
              index % 2 === 0
                ? "from-cyan-500 to-blue-600"
                : "from-violet-500 to-fuchsia-600",
          };
        })
      );

      setAccounts(finalAccounts);
    } catch (error) {
      console.log("Error fetching accounts:", error.response?.data || error.message);
      setAccounts([]);
    }
  };

  const totalBalance = (accounts || []).reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Welcome */}

        <div className="flex flex-col mt-5 mb-25 gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome 👋
            </h1>

            <p className="mt-2 text-gray-400">
              Manage your banking ledger system from one place.
            </p>
          </div>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
          >
            + Create New Account
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 mt-30 mb-30 gap-15 md:grid-cols-2 xl:grid-cols-3">

          <StatCard
            title="Total Balance"
            value={`₹${totalBalance.toLocaleString("en-IN")}`}
            icon={Wallet}
            change={`${(accounts || []).length} Accounts`}
            color="from-cyan-500 to-blue-600"
          />

          <StatCard
            title="Accounts"
            value={(accounts || []).length}
            icon={Landmark}
            change="Active Accounts"
            color="from-violet-500 to-fuchsia-600"
          />
          <StatCard
            title="Transactions"
            value={(transactions || []).length}
            icon={ArrowLeftRight}
            change="Total Transactions"
            color="from-emerald-500 to-teal-600"
          />

        </div>

        <QuickActions
          onCreateAccount={() => setOpenCreateModal(true)}
          onTransferMoney={() => setOpenTransferModal(true)}
        />

        {/* Accounts */}

        <section className="mb-20 mt-50 ">

          <div className="mb-10">

            <h2 className="text-4xl font-bold text-white">
              My Accounts
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-15 md:grid-cols-2 xl:grid-cols-3">

            {(accounts || []).map((account) => (
              <AccountCard
                key={account._id}
                bankName={account.bankName}
                accountType={account.accountType}
                accountNumber={account.accountNumber}
                balance={account.balance}
                color={account.color}
              />
            ))}

          </div>

        </section>

        <RecentTransactions
          transactions={transactions}
          accounts={accounts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          filter={filter}
          setFilter={setFilter}
        />

      </div>

      <CreateAccountModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={() => {
          setOpenCreateModal(false);
          fetchAccounts();
        }}
      />

      <TransferMoneyModal
        isOpen={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
        accounts={accounts}
        onSuccess={() => {
          fetchAccounts();
          fetchTransactions();
          setOpenTransferModal(false);
        }}
      />

    </DashboardLayout>


  );
}