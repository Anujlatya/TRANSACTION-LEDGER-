import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

export default function LedgerTable({ ledgers }) {

    const getStatus = (status) => {

        switch (status) {

            case "COMPLETED":
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                        <CheckCircle2 size={14} />
                        Completed
                    </span>
                );

            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                        <Clock3 size={14} />
                        Pending
                    </span>
                );

            default:
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
                        <XCircle size={14} />
                        Failed
                    </span>
                );
        }
    };

    return (

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-white/10 text-left text-gray-400">

                            <th className="pb-5">Type</th>
                            <th className="pb-5">From Account</th>
                            <th className="pb-5">To Account</th>
                            <th className="pb-5">Amount</th>
                            <th className="pb-5">Status</th>
                            <th className="pb-5">Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {ledgers.map((ledger) => {

                            const isCredit = ledger.type === "CREDIT";

                            return (

                                <tr
                                    key={ledger._id}
                                    className="border-b border-white/5 hover:bg-white/5 transition"
                                >

                                    <td className="py-6">

                                        <div className={`flex items-center gap-2 ${isCredit ? "text-emerald-400" : "text-red-400"}`}>

                                            {isCredit
                                                ? <ArrowDownLeft size={18} />
                                                : <ArrowUpRight size={18} />
                                            }

                                            {ledger.type}

                                        </div>

                                    </td>
                                    
                                    <td className="font-mono text-white">
                                        {ledger.transaction.fromAccount?.accountNumber}
                                    </td>

                                    <td className="font-mono text-white">
                                        {ledger.transaction.toAccount?.accountNumber}
                                    </td>

                                    <td className={`font-semibold ${isCredit ? "text-emerald-400" : "text-red-400"}`}>

                                        {isCredit ? "+" : "-"}₹
                                        {ledger.amount.toLocaleString("en-IN")}

                                    </td>

                                    <td>

                                        {getStatus(ledger.transaction.status)}

                                    </td>

                                    <td className="text-gray-400">

                                        {
                                            new Date(
                                                ledger.transaction.createdAt
                                            ).toLocaleString("en-IN")
                                        }

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </section>

    );

}