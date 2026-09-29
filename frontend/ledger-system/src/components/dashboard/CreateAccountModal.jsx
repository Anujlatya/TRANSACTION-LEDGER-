import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createAccount } from "../../services/accountService";

export default function CreateAccountModal({
    isOpen,
    onClose,
    onCreate,
}) {
    const [checked, setChecked] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-lg rounded-3xl bg-[#0B1220] border border-white/10 p-8 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                Create New Account
                            </h2>

                            <button onClick={onClose}>
                                <X />
                            </button>
                        </div>

                        <p className="mt-6 text-gray-400 leading-7">
                            You are about to create a new ledger account.
                            Please confirm that you understand this action.
                        </p>

                        <label className="mt-6 flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />

                            <span className="text-sm text-gray-300">
                                I understand and want to create a new account.
                            </span>
                        </label>

                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="rounded-xl border border-white/20 px-5 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!checked}
                                onClick={async () => {
                                    try {
                                        const res = await createAccount();

                                        console.log(res.data);

                                        alert("Account Created Successfully");

                                        onCreate();

                                    } catch (error) {
                                        console.log(error);
                                        console.log(error.response);
                                        console.log(error.response?.data);

                                        alert(error.response?.data?.message || error.message);
                                    }
                                }}
                                className="rounded-xl bg-cyan-500 px-5 py-2 disabled:opacity-50"
                            >
                                Create Account
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}