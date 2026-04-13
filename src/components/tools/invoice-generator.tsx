"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn, escapeHtml } from "@/lib/utils";
import { Plus, Trash2, Printer, Copy, Check } from "lucide-react";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type ContactInfo = {
  name: string;
  email: string;
  address: string;
};

const CURRENCIES: Record<string, { symbol: string; code: string; locale: string }> = {
  USD: { symbol: "$", code: "USD", locale: "en-US" },
  EUR: { symbol: "€", code: "EUR", locale: "de-DE" },
  GBP: { symbol: "£", code: "GBP", locale: "en-GB" },
  CAD: { symbol: "C$", code: "CAD", locale: "en-CA" },
};

function formatCurrency(amount: number, currency: string): string {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
    minimumFractionDigits: 2,
  }).format(amount);
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function dueDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

function buildPrintHtml(
  from: ContactInfo,
  billTo: ContactInfo,
  invoiceNumber: string,
  date: string,
  dueDate: string,
  items: LineItem[],
  subtotal: number,
  taxRate: number,
  taxAmount: number,
  total: number,
  notes: string,
  currency: string
): string {
  const fmt = (n: number) => formatCurrency(n, currency);

  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:left">${escapeHtml(item.description) || "-"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(item.unitPrice)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(item.quantity * item.unitPrice)}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice ${escapeHtml(invoiceNumber)}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1a1a1a; background:#fff; }
  .invoice { max-width:800px; margin:0 auto; padding:48px 40px; }
  .accent-bar { height:4px; background:linear-gradient(90deg,#c8a24e,#d4af60); border-radius:2px; margin-bottom:40px; }
  @media print { body { print-color-adjust:exact; -webkit-print-color-adjust:exact; } .invoice { padding:20px; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="accent-bar"></div>

  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
    <div>
      <h1 style="font-size:32px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px">INVOICE</h1>
    </div>
    <div style="text-align:right;font-size:13px;color:#555">
      <p style="margin-bottom:4px"><strong>Invoice #:</strong> ${escapeHtml(invoiceNumber)}</p>
      <p style="margin-bottom:4px"><strong>Date:</strong> ${escapeHtml(date)}</p>
      <p><strong>Due:</strong> ${escapeHtml(dueDate)}</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px">
    <div>
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:8px">From</p>
      <p style="font-size:14px;font-weight:600;margin-bottom:4px">${escapeHtml(from.name) || "-"}</p>
      <p style="font-size:13px;color:#555;margin-bottom:2px">${escapeHtml(from.email)}</p>
      <p style="font-size:13px;color:#555;white-space:pre-line">${escapeHtml(from.address)}</p>
    </div>
    <div>
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:8px">Bill To</p>
      <p style="font-size:14px;font-weight:600;margin-bottom:4px">${escapeHtml(billTo.name) || "-"}</p>
      <p style="font-size:13px;color:#555;margin-bottom:2px">${escapeHtml(billTo.email)}</p>
      <p style="font-size:13px;color:#555;white-space:pre-line">${escapeHtml(billTo.address)}</p>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead>
      <tr style="background:#f8f8f8">
        <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#777;border-bottom:2px solid #e5e7eb">Description</th>
        <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#777;border-bottom:2px solid #e5e7eb;width:80px">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#777;border-bottom:2px solid #e5e7eb;width:120px">Unit Price</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#777;border-bottom:2px solid #e5e7eb;width:120px">Total</th>
      </tr>
    </thead>
    <tbody style="font-size:13px">
      ${rows}
    </tbody>
  </table>

  <div style="display:flex;justify-content:flex-end;margin-bottom:40px">
    <div style="width:260px">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555">
        <span>Subtotal</span><span>${fmt(subtotal)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555;border-bottom:1px solid #e5e7eb">
        <span>Tax (${taxRate}%)</span><span>${fmt(taxAmount)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:700">
        <span>Total</span><span>${fmt(total)}</span>
      </div>
    </div>
  </div>

  ${
    notes.trim()
      ? `<div style="border-top:1px solid #e5e7eb;padding-top:24px">
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:8px">Notes / Terms</p>
    <p style="font-size:13px;color:#555;white-space:pre-line">${escapeHtml(notes)}</p>
  </div>`
      : ""
  }
</div>
</body>
</html>`;
}

const inputClass =
  "w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10";

export function InvoiceGenerator() {
  const [from, setFrom] = useState<ContactInfo>({ name: "", email: "", address: "" });
  const [billTo, setBillTo] = useState<ContactInfo>({ name: "", email: "", address: "" });
  const [invoiceNumber] = useState(() => `INV-${Date.now().toString(36).toUpperCase()}`);
  const [date, setDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(dueDateStr);
  const [items, setItems] = useState<LineItem[]>([
    { id: generateId(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [copied, setCopied] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { id: generateId(), description: "", quantity: 1, unitPrice: 0 }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  }, []);

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }, []);

  const handleGenerate = useCallback(() => {
    const html = buildPrintHtml(from, billTo, invoiceNumber, date, dueDate, items, subtotal, taxRate, taxAmount, total, notes, currency);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  }, [from, billTo, invoiceNumber, date, dueDate, items, subtotal, taxRate, taxAmount, total, notes, currency]);

  const handleCopyNumber = useCallback(async () => {
    await navigator.clipboard.writeText(invoiceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [invoiceNumber]);

  const updateFrom = (field: keyof ContactInfo, value: string) =>
    setFrom((prev) => ({ ...prev, [field]: value }));
  const updateBillTo = (field: keyof ContactInfo, value: string) =>
    setBillTo((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      {/* From / Bill To */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">From</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={from.name}
              onChange={(e) => updateFrom("name", e.target.value)}
              placeholder="Company / Your name"
              className={inputClass}
            />
            <input
              type="email"
              value={from.email}
              onChange={(e) => updateFrom("email", e.target.value)}
              placeholder="email@example.com"
              className={inputClass}
            />
            <textarea
              value={from.address}
              onChange={(e) => updateFrom("address", e.target.value)}
              placeholder="Street address, city, country"
              rows={2}
              className={cn(inputClass, "resize-none")}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Bill To</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={billTo.name}
              onChange={(e) => updateBillTo("name", e.target.value)}
              placeholder="Client name"
              className={inputClass}
            />
            <input
              type="email"
              value={billTo.email}
              onChange={(e) => updateBillTo("email", e.target.value)}
              placeholder="client@example.com"
              className={inputClass}
            />
            <textarea
              value={billTo.address}
              onChange={(e) => updateBillTo("address", e.target.value)}
              placeholder="Client address"
              rows={2}
              className={cn(inputClass, "resize-none")}
            />
          </div>
        </motion.div>
      </div>

      {/* Invoice details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
      >
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Invoice #
            </label>
            <div className="flex items-center gap-2">
              <span className="truncate rounded-lg border border-border/50 bg-background/30 px-3 py-2.5 font-mono text-sm text-foreground/80">
                {invoiceNumber}
              </span>
              <button
                onClick={handleCopyNumber}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c}>
                  {c} ({CURRENCIES[c].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Line Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/15 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </button>
        </div>

        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_80px_110px_110px_36px] gap-2 px-1 sm:grid">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Description
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Qty
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Unit Price
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Total
            </span>
            <span />
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_110px_110px_36px] items-center gap-2"
            >
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                placeholder="Item description"
                className={cn(inputClass, "text-xs")}
              />
              <input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", Math.max(0, parseInt(e.target.value) || 0))}
                className={cn(inputClass, "text-center text-xs")}
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))}
                className={cn(inputClass, "text-right text-xs")}
              />
              <div className="flex items-center justify-end rounded-lg border border-border/30 bg-background/20 px-3 py-2.5 font-mono text-xs text-foreground/70">
                {formatCurrency(item.quantity * item.unitPrice, currency)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:text-red-400 disabled:opacity-30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-[280px] space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                Tax
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 rounded border border-border/50 bg-background/50 px-2 py-1 text-center text-xs text-foreground focus:border-foreground/20 focus:outline-none"
                />
                <span className="text-xs">%</span>
              </span>
              <span className="font-mono">{formatCurrency(taxAmount, currency)}</span>
            </div>
            <div className="border-t border-border/50 pt-2">
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>Total</span>
                <span className="font-mono text-foreground/80">{formatCurrency(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-surface/30 p-5 backdrop-blur-sm"
      >
        <label className="mb-1.5 block text-sm font-medium text-foreground/80">
          Notes / Terms
          <span className="ml-1 text-xs text-muted-foreground/50">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Payment terms, thank you note, etc."
          rows={3}
          className={cn(inputClass, "resize-none")}
        />
      </motion.div>

      {/* Generate */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Printer className="h-4 w-4" />
          Generate PDF
        </button>
      </div>
    </div>
  );
}
