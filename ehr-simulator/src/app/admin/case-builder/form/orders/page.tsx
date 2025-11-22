"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import SubmitButton from "../../components/submitButton"
import { useRouter } from "next/navigation"


interface OrderType {
  category: "Nursing" | "Respiratory" | "Laboratory" | "Consult"
  title: string
  details: string
  status: "Active" | "Held"
  provider: string
  important: boolean
}

const categories: OrderType["category"][] = ["Nursing", "Respiratory", "Laboratory", "Consult"]


const OrdersForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);

    router.push('/admin/case-builder/form/labs')
  }

  const [orders, setOrders] = useState<OrderType[]>([]);
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
      category: category as OrderType["category"],
      title: title,
      details: details,
      status: status as OrderType["status"],
      provider: provider,
      important: importance
    }])
    clears();
  }

  function removeOrder(index: number) {
    setOrders(orders.filter((_, i) => i !== index))
  }

  function OrdersTable({ orders, category }: { orders: OrderType[]; category: OrderType["category"] }) {
    const categoryOrders = orders.filter(order => order.category == category);
    return (
      <>
        {
          categoryOrders.length > 0 && (
            <>
              <p className="text-xl">{category} Orders</p><table className="w-full mb-8 border-collapse">
                <tbody className="w-full">
                  <tr className="">
                    {["Title", "Details", "Status", "Provider", "Important", ""].map((header, index) => (
                      <th className="text-left" key={index}>{header}</th>
                    ))}
                  </tr>

                  {categoryOrders
                    .map((order, index) => (
                      <tr className="even:bg-accent" key={index}>
                        {[
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
                            onClick={() => {
                              const originalIndex = orders.indexOf(order)
                              if (originalIndex !== -1) removeOrder(originalIndex)
                            }}
                            className="p-1 hover:bg-red-100 bg-red-50 cursor-pointer rounded transition-colors"
                            title="Remove order"
                            type="button"
                          >
                            <X size={20} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )
        }
      </>


    )
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
        <Card className="relative pb-0">
          <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit}>
            <div className="absolute top-8 right-8">
              <SubmitButton buttonText="Continue" />
            </div>
            <div className="w-full flex flex-col gap-2 p-2">
              <input type="hidden" name="orders" value={JSON.stringify(orders)} />

              <p className="m-2 mb-4 ml-0 text-2xl font-bold">Orders</p>

              <div className="w-full grid gap-4">
                <div className="flex">
                  <label htmlFor="" className="case-form-label">Category:</label>
                  <select
                    value={category}
                    className="case-form-select"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" hidden disabled>Select...</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Consult">Consult</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="case-form-label">Title:</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className="case-form-input-text"
                    placeholder="Title..."
                  />
                </div>

                <div className="flex flex-col">
                  <label className="case-form-label">Details:</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="case-form-textarea"
                    placeholder="Enter text..."
                  />
                </div>

                <div className="flex">
                  <label className="case-form-label">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="case-form-select"
                  >
                    <option value="" disabled hidden>Select...</option>
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
                    placeholder="Name..."
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


              {categories.map((category, index) => (
                <OrdersTable key={index} orders={orders} category={category} />
              ))}

            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

export default OrdersForm