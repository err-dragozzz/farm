"use client";
import type React from "react";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import { motion } from "framer-motion";

import { toast } from "sonner";

import {
  FileDown,
  FileText,
  ReceiptText,
  Trash2,
  Upload,
  DollarSign,
  TrendingUp,
  Wallet,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { EmptyState } from "@/components/ui/empty-state";

import { useApi } from "@/hooks/use-api";

import { currency } from "@/lib/utils";

import type {
  Farm,
  Transaction
} from "@/types/farmledger";

const expenseCategories = [
  "seeds",
  "fertilizer",
  "labor",
  "irrigation",
  "pesticide",
  "transport",
  "machinery",
  "diesel",
  "electricity",
  "other"
];

export function TransactionsClient({
  type
}: {
  type: "income" | "expense";
}) {
  const {
    data: transactions,
    refresh
  } = useApi<Transaction[]>(
    `/api/transactions?type=${type}`
  );

  const { data: farms } =
    useApi<Farm[]>("/api/farms");

  const [form, setForm] = useState({
    farmId: "",
    category:
      type === "income"
        ? "crop sale"
        : "seeds",
    amount: "",
    quantity: "",
    pricePerKg: "",
    buyerName: "",
    vendorName: "",
    notes: "",
    image: "",
    paymentStatus: "paid",
    recurring: false
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      category:
        type === "income"
          ? "crop sale"
          : "seeds"
    }));
  }, [type]);

  const calculated = useMemo(
    () =>
      Number(form.quantity || 0) *
      Number(form.pricePerKg || 0),
    [form.quantity, form.pricePerKg]
  );

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const response = await fetch(
      "/api/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          ...form,
          type,
          amount:
            type === "income" &&
            calculated > 0
              ? calculated
              : Number(form.amount)
        })
      }
    );

    if (!response.ok) {
      return toast.error(
        "Could not save transaction"
      );
    }

    toast.success(
      type === "income"
        ? "Income recorded"
        : "Expense recorded"
    );

    refresh();
  }

  async function remove(id: string) {
    await fetch(
      `/api/transactions/${id}`,
      {
        method: "DELETE"
      }
    );

    toast.success(
      "Transaction deleted"
    );

    refresh();
  }

  async function uploadImage(
    file?: File
  ) {
    if (!file) return;

    const body = new FormData();

    body.append("file", file);

    const response = await fetch(
      "/api/upload",
      {
        method: "POST",
        body
      }
    );

    const result = await response.json();

    if (result.url) {
      setForm((current) => ({
        ...current,
        image: result.url
      }));
    }

    toast(
      result.url
        ? "File uploaded"
        : result.message
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      {/* LEFT PANEL */}
      <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

        <CardHeader className="relative z-10">
          <Badge className="w-fit border-0 bg-green-500/15 text-green-300">
            Financial Tracking
          </Badge>

          <CardTitle className="mt-3 text-2xl font-bold">
            {type === "income"
              ? "Record crop sale"
              : "Add expense"}
          </CardTitle>

          <CardDescription className="text-white/50">
            {type === "income"
              ? "Track sales, buyers, quantity, and payment collection."
              : "Manage expenses, recurring payments, and vendors."}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form
            className="space-y-5"
            onSubmit={submit}
          >
            {/* FARM */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Farm
              </Label>

              <Select
                value={form.farmId}
                onValueChange={(farmId) =>
                  setForm((current) => ({
                    ...current,
                    farmId
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white">
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-[#111827] text-white">
                  {farms?.map((farm) => (
                    <SelectItem
                      key={farm.id}
                      value={farm.id}
                    >
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Category
              </Label>

              {type === "expense" ? (
                <Select
                  value={form.category}
                  onValueChange={(
                    category
                  ) =>
                    setForm(
                      (current) => ({
                        ...current,
                        category
                      })
                    )
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="border-white/10 bg-[#111827] text-white">
                    {expenseCategories.map(
                      (category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category:
                        event.target
                          .value
                    }))
                  }
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
                />
              )}
            </div>

            {/* INCOME EXTRA */}
            {type === "income" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">
                    Quantity kg
                  </Label>

                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          quantity:
                            event.target
                              .value
                        })
                      )
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">
                    Price / kg
                  </Label>

                  <Input
                    type="number"
                    value={
                      form.pricePerKg
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          pricePerKg:
                            event.target
                              .value
                        })
                      )
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
                  />
                </div>
              </div>
            )}

            {/* AMOUNT */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Amount
              </Label>

              <Input
                type="number"
                value={
                  type === "income" &&
                  calculated > 0
                    ? String(calculated)
                    : form.amount
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    amount:
                      event.target.value
                  }))
                }
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
              />
            </div>

            {/* CONTACT */}
            <div className="space-y-2">
              <Label className="text-white/80">
                {type === "income"
                  ? "Buyer"
                  : "Vendor"}
              </Label>

              <Input
                value={
                  type === "income"
                    ? form.buyerName
                    : form.vendorName
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [
                      type === "income"
                        ? "buyerName"
                        : "vendorName"
                    ]:
                      event.target.value
                  }))
                }
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
              />
            </div>

            {/* NOTES */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Notes
              </Label>

              <Input
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes:
                      event.target.value
                  }))
                }
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
              />
            </div>

            {/* RECURRING */}
            {type === "expense" && (
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                <input
                  type="checkbox"
                  checked={
                    form.recurring
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        recurring:
                          event.target
                            .checked
                      })
                    )
                  }
                />

                Recurring expense
              </label>
            )}

            {/* PAYMENT STATUS */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Payment status
              </Label>

              <Select
                value={form.paymentStatus}
                onValueChange={(
                  paymentStatus
                ) =>
                  setForm((current) => ({
                    ...current,
                    paymentStatus
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-[#111827] text-white">
                  {[
                    "paid",
                    "pending",
                    "overdue",
                    "cancelled"
                  ].map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* UPLOAD */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Invoice / bill
              </Label>

              <label className="flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] text-sm transition hover:border-green-500/30 hover:bg-white/[0.05]">
                <Upload className="h-4 w-4" />

                Upload file

                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    uploadImage(
                      event.target
                        .files?.[0]
                    )
                  }
                />
              </label>
            </div>

            {/* BUTTON */}
            <Button
              className="
                
h-11
rounded-xl
border
border-green-500/20
bg-gradient-to-b
from-green-500
to-green-600
px-6
text-white
font-medium
shadow-[0_4px_20px_rgba(34,197,94,0.18)]
transition-all
duration-200
hover:brightness-110
hover:shadow-[0_6px_24px_rgba(34,197,94,0.28)]
active:scale-[0.98]0
              "
            >
              <Plus className="mr-2 h-4 w-4" />
              Save {type}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RIGHT SIDE */}
      <section className="space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {type === "income"
                ? "Income ledger"
                : "Expense ledger"}
            </h2>

            <p className="mt-1 text-white/50">
              Smart financial records
              with export workflows.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <a href="/api/reports?format=csv">
              <FileDown className="mr-2 h-4 w-4" />
              CSV
            </a>
          </Button>
        </div>

        {/* EMPTY */}
        {!transactions?.length && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-14">
            <EmptyState
              icon={ReceiptText}
              title="No transactions"
              description="Add entries to unlock analytics, reports, and payment tracking."
            />
          </div>
        )}

        {/* TRANSACTIONS */}
        <div className="space-y-4">
          {transactions?.map(
            (tx, index) => (
              <motion.div
                key={tx.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay:
                    index * 0.05
                }}
              >
                <Card className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 hover:border-green-500/30">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-green-500/10 p-4">
                        {type ===
                        "income" ? (
                          <TrendingUp className="h-5 w-5 text-green-400" />
                        ) : (
                          <Wallet className="h-5 w-5 text-yellow-300" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">
                            {tx.category}
                          </p>

                          <Badge
                            className={
                              tx.paymentStatus ===
                              "paid"
                                ? "bg-green-500/15 text-green-300 border-0"
                                : "bg-yellow-500/15 text-yellow-300 border-0"
                            }
                          >
                            {
                              tx.paymentStatus
                            }
                          </Badge>
                        </div>

                        <p className="mt-1 text-sm text-white/50">
                          {
                            tx.farm?.name
                          }{" "}
                          ·{" "}
                          {tx.buyerName ??
                            tx.vendorName ??
                            "No contact"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-white/40">
                          Amount
                        </p>

                        <p className="text-2xl font-bold">
                          {currency(
                            tx.amount
                          )}
                        </p>
                      </div>

                      {type ===
                        "income" && (
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                        >
                          <a
                            href={`/api/transactions/${tx.id}/invoice`}
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-500/10 hover:text-red-300"
                        onClick={() =>
                          remove(tx.id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

