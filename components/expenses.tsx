import React, { useState } from "react";
import { useStore } from "../store";
import { Expense } from "../types";
import { Plus, Receipt, Calendar, Trash2, X, PlusCircle } from "lucide-react";

const Expenses: React.FC = () => {
  const {
    expenses = [],
    addExpense,
    updateExpense,
    deleteExpense,
    currentShop,
  } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: "Rent",
    amount: 0,
    notes: "",
    date: new Date().toISOString(),
  });

  const categories = [
    "Rent",
    "Utility",
    "Salary",
    "Transport",
    "Marketing",
    "Tea/Snacks",
    "Other",
  ];

  const handleSave = () => {
    if (!currentShop) {
      alert("Please select a shop first.");
      return;
    }
    if (newExpense.amount && newExpense.amount > 0) {
      if (editingId) {
        updateExpense({
          id: editingId,
          shopId: currentShop.id,
          category: newExpense.category || "Other",
          amount: newExpense.amount,
          notes: newExpense.notes || "",
          date: newExpense.date || new Date().toISOString(),
        });
      } else {
        addExpense({
          id: Date.now().toString(),
          shopId: currentShop.id,
          category: newExpense.category || "Other",
          amount: newExpense.amount,
          notes: newExpense.notes || "",
          date: newExpense.date || new Date().toISOString(),
        });
      }
      setIsAdding(false);
      setEditingId(null);
      setNewExpense({
        category: "Rent",
        amount: 0,
        notes: "",
        date: new Date().toISOString(),
      });
    }
  };

  const handleEdit = (expense: Expense) => {
    setNewExpense(expense);
    setEditingId(expense.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

  const totalMonthly = expenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Expenses
        </h2>
        <button
          onClick={() => {
            setEditingId(null);
            setNewExpense({
              category: "Rent",
              amount: 0,
              notes: "",
              date: new Date().toISOString(),
            });
            setIsAdding(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-indigo-950/30"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between overflow-hidden relative">
        <div className="z-10">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            This Month's Spending
          </p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white">
            ৳{totalMonthly.toLocaleString()}
          </h3>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center text-indigo-200 dark:text-indigo-900/50 -z-0">
          <Receipt size={80} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">
          Expense History
        </h3>
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-xl flex items-center justify-center">
                <Receipt size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">
                  {expense.category}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-600 font-medium">
                  <Calendar size={10} />{" "}
                  {new Date(expense.date).toLocaleDateString()}
                  {expense.notes && <span>• {expense.notes}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-black text-rose-500">৳{expense.amount}</p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(expense)}
                  className="p-2 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
                >
                  <PlusCircle size={18} className="rotate-45" />
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="p-2 text-slate-400 dark:text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-700">
            No expenses recorded.
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingId ? "Edit Expense" : "Record Expense"}
              </h3>
              <button onClick={() => setIsAdding(false)}>
                <X size={24} className="text-slate-400 dark:text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Category
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setNewExpense({ ...newExpense, category: cat })
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        newExpense.category === cat
                          ? "bg-rose-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white text-xl font-black"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white h-24"
                  placeholder="Tea, Transport, Rent etc..."
                  value={newExpense.notes}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, notes: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 dark:shadow-rose-950/30 mt-4 active:scale-[0.98] transition-all"
              >
                {editingId ? "Update Expense" : "Save Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
