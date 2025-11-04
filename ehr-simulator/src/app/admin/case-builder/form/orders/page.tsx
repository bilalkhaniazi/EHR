"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface OrderType {
  category: "Nursing" | "Respiratory" | "Laboratory"
  title: string
  details: string
  status: "Active" | "Held"
  provider: string
  important: boolean
}

const OrdersForm = () => {
  const [orders, setOrders] = useState<object[]>([]);
  const [canAddOrder, setCanAddOrder] = useState<boolean>(false);

  const [categoryInput, setCategoryInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [detailsInput, setDetailsInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [providerInput, setProviderInput] = useState("");
  const [importanceInput, setImportanceInput] = useState(false)

  useEffect(() => {
    // Check if all required fields are filled (importance is optional)
    setCanAddOrder([
      categoryInput,
      titleInput,
      detailsInput,
      statusInput,
      providerInput
    ].every(inputField => (inputField.trim() !== "")));
  }, [categoryInput, titleInput, detailsInput, statusInput, providerInput]);

  function clearInputs() {
    setCategoryInput("")
    setTitleInput("")
    setDetailsInput("")
    setStatusInput("")
    setProviderInput("")
    setImportanceInput(false)
  }

  function createOrder() {
    setOrders([...orders, {
      category: categoryInput,
      title: titleInput,
      details: detailsInput,
      status: statusInput,
      provider: providerInput,
      important: importanceInput
    }])
    clearInputs();
  }

  function removeOrder(index: number) {
    setOrders(orders.filter((_, i) => i !== index))
  }

  return (
    <>
      <input type="hidden" name="orders" value={JSON.stringify(orders)} />

      <p className="m-2 mb-4 ml-0 text-2xl font-bold">Orders</p>

      {/* Don't display table unless there are orders */}
      {orders.length > 0 ?
        <table className="w-full mb-8 border-collapse">
          <tbody className="w-full">
            <tr className="">
              {["", "Category", "Title", "Details", "Status", "Provider", "Important", ""].map((heading, index) => (
                <th className="text-left" key={index}>{heading}</th>
              ))}
            </tr>

            {orders
              .map((order, index) => (
                <tr className="even:bg-accent" key={index}>
                  <td className="border-1 text-center">{index + 1}</td>
                  {[
                    (order as OrderType).category.trim(),
                    (order as OrderType).title.trim(),
                    (order as OrderType).details.trim(),
                    (order as OrderType).status.trim(),
                    (order as OrderType).provider.trim(),
                    (order as OrderType).important ? "Yes" : "No"
                  ].map((entry, entryIndex) => (
                    <td className="pl-2 pr-4 border-1" key={entryIndex}>{entry}</td>
                  ))}
                  <td className="bg-white border-0 pl-2 pr-4">
                    <button
                      onClick={() => { removeOrder(index) }}
                      className="p-1 hover:bg-red-100 bg-red-50 cursor-pointer rounded transition-colors"
                      title="Remove order"
                    >
                      <X size={20} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        : <></>}
      <div className="w-full grid gap-1">
        <div className="flex">
          <label htmlFor="" className="case-form-label">Category:</label>
          <select
            value={categoryInput}
            className="case-form-select"
            onChange={(e) => setCategoryInput(e.target.value)}
          >
            <option value="" hidden disabled>Select</option>
            <option value="Nursing">Nursing</option>
            <option value="Respiratory">Respiratory</option>
            <option value="Laboratory">Laboratory</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="case-form-label">Title:</label>
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            type="text"
            className="case-form-input-text"
          />
        </div>

        <div className="flex flex-col">
          <label className="case-form-label">Details:</label>
          <textarea
            value={detailsInput}
            onChange={(e) => setDetailsInput(e.target.value)}
            className="case-form-textarea"
          ></textarea>
        </div>

        <div className="flex">
          <label className="case-form-label">Status:</label>
          <select
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
            className="case-form-select"
          >
            <option value="" disabled hidden>Select</option>
            <option value="Active">Active</option>
            <option value="Held">Held</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="case-form-label">Provider:</label>
          <input
            value={providerInput}
            onChange={(e) => setProviderInput(e.target.value)}
            type="text"
            className="case-form-input-text"
          />
        </div>

        <div className="">
          <label className="case-form-label">Mark as Important:</label>
          <input type="checkbox" checked={importanceInput} onChange={(e) => setImportanceInput(e.target.checked)} />
        </div>
      </div>

      <button
        disabled={!canAddOrder}
        title={!canAddOrder ? "Order incomplete" : ""}
        className="
          disabled:cursor-not-allowed disabled:opacity-55
          cursor-pointer mb-4 border-1 border-[#333] rounded bg-[#eaeaea] pl-2 pr-2 inline w-fit"
        type="button"
        onClick={createOrder}>
        Add Order to Case +
      </button>
    </>
  )
}

export default OrdersForm