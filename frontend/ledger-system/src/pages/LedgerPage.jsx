import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getLedgerHistory } from "../services/transactionService";
import LedgerTable from "../components/ledger/LedgerTable";

export default function LedgerPage() {

    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        try {
            const res = await getLedgerHistory();
            const rawLedgers = res.data?.data?.ledgers || res.data?.ledgers || res.data?.data || res.data || [];
            setLedgers(Array.isArray(rawLedgers) ? rawLedgers : []);
        } catch (error) {
            console.log(error.response?.data || error.message);
            setLedgers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>

            <div className="space-y-8">

                {/* Header */}

                <div>

                    <h1 className="text-4xl font-bold text-white">
                        Ledger History
                    </h1>

                    <p className="mt-2 text-gray-400">
                        View all your account transactions.
                    </p>

                </div>

                {/* Ledger Data */}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

                    {loading ? (

                        <div className="py-20 text-center text-lg text-white">
                            Loading...
                        </div>

                    ) : ledgers.length === 0 ? (

                        <div className="py-20 text-center text-lg text-gray-400">
                            No Ledger Found
                        </div>

                    ) : (

                        <LedgerTable
                            ledgers={ledgers}
                        />

                    )}

                </div>

            </div>

        </DashboardLayout>
    );
}