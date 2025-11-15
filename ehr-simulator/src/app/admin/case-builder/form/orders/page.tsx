"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import SubmitButton from "../../components/submitButton"

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.target as HTMLFormElement);
  const payload = Object.fromEntries(formData);
  console.log(payload);

  // Process data and save to patient object
  // Move to next page of the form
  // Backend shenanigans
}

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

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [importance, setImportance] = useState(false)

  useEffect(() => {
    // Check if all required fields are filled (importance is optional)
    setCanAddOrder([
      category,
      title,
      details,
      status,
      provider
    ].every(inputField => (inputField.trim() !== "")));
  }, [category, title, details, status, provider]);

  function clears() {
    setCategory("")
    setTitle("")
    setDetails("")
    setStatus("")
    setProvider("")
    setImportance(false)
  }

  function createOrder() {
    setOrders([...orders, {
      category: category,
      title: title,
      details: details,
      status: status,
      provider: provider,
      important: importance
    }])
    clears();
  }

  function removeOrder(index: number) {
    setOrders(orders.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
        <Card className="h-fit">
          <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
            <div className="w-full flex flex-col gap-2 p-2">
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
                          <td className="border text-center">{index + 1}</td>
                          {[
                            (order as OrderType).category.trim(),
                            (order as OrderType).title.trim(),
                            (order as OrderType).details.trim(),
                            (order as OrderType).status.trim(),
                            (order as OrderType).provider.trim(),
                            (order as OrderType).important ? "Yes" : "No"
                          ].map((entry, entryIndex) => (
                            <td className="pl-2 pr-4 border" key={entryIndex}>{entry}</td>
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
              <div className="w-full grid gap-4">
                <div className="flex">
                  <label htmlFor="" className="case-form-label">Category:</label>
                  <select
                    value={category}
                    className="case-form-select"
                    onChange={(e) => setCategory(e.target.value)}
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className="case-form-input-text"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="case-form-label">Details:</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="case-form-textarea"
                  ></textarea>
                </div>

                <div className="flex">
                  <label className="case-form-label">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    type="text"
                    className="case-form-input-text"
                  />
                </div>

                <div className="">
                  <label className="case-form-label">Mark as Important:</label>
                  <input type="checkbox" checked={importance} onChange={(e) => setImportance(e.target.checked)} />
                </div>
              </div>

              <button
                disabled={!canAddOrder}
                title={!canAddOrder ? "Order incomplete" : ""}
                className="disabled:cursor-not-allowed disabled:opacity-55 cursor-pointer mb-4 border border-[#333] rounded bg-[#eaeaea] pl-2 pr-2 inline w-fit"
                type="button"
                onClick={createOrder}>
                Add Order to Case +
              </button>

              <SubmitButton buttonText="Continue" />

            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

export default OrdersForm