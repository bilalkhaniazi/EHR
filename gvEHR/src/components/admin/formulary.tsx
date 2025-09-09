import { useState } from "react"
import { allMedications } from "../mar/marData"
import AdminMedCard from "./adminMedCard"
import JsBarcode from 'jsbarcode'
import bwipjs from '../../../node_modules/bwip-js'

const Formulary = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [isPrinting, setIsPrinting] = useState<boolean>(false)

  const handleMedChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelected(prev => {
        return [...prev, id];
      })
    } else {
      setSelected(prev => {
        return [...prev].filter(medId => medId !== id)
      })
    }
  };


  // all the following barcode printing was a quick vibe code to make barcodes to practice scanning integration
  const generateBarcodeSVG = (medId: string): string => {
    // replaced with data matrix function below
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, medId, {
      format: "CODE128",
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 12,
      textMargin: 5,
      margin: 0
    })
    return canvas.toDataURL()
  }

  const generateDataMatrixSVG = (medId: string): string => {
    const svg = bwipjs.toSVG({
      bcid: 'datamatrix',
      text: medId,
      height: 12,
      includetext: true,
      textxalign: 'center',
    })
    return svg
  }

  const printBarcodes = async () => {
    if (selected.length === 0) {
      alert('Please select medications to print')
      return
    }

    setIsPrinting(true)

    try {
      // Get selected medications
      const selectedMeds = allMedications.filter(med => selected.includes(med.id))

      // Create print window
      const printWindow = window.open('', '_blank', 'width=800,height=600')

      if (!printWindow) {
        alert('Please allow pop-ups to print barcodes')
        return
      }

      // Generate barcodes for each medication
      const barcodePromises = selectedMeds.map(async (med) => {
        const barcodeDataUrl = generateDataMatrixSVG(med.id)
        return { ...med, barcodeDataUrl }
      })

      const medsWithBarcodes = await Promise.all(barcodePromises)

      // Create the print document
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Medication Barcodes</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 0.5in;
              background: white;
            }
            
            .page-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            
            .label-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              width: 100%;
            }
            
            .label {
              border: 1px solid #333;
              padding: 8px;
              text-align: center;
              background: white;
              page-break-inside: avoid;
              min-height: 120px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            .med-info {
              margin-bottom: 8px;
            }
            
            .med-name {
              font-weight: bold;
              font-size: 11px;
              margin-bottom: 2px;
            }
            
            .med-details {
              font-size: 9px;
              color: #666;
              line-height: 1.2;
            }
            
            .barcode-container {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .barcode-container img {
              max-width: 100%;
              height: auto;
            }
            
            @media print {
              body {
                padding: 0.25in;
              }
              
              .label {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              
              .page-header {
                margin-bottom: 15px;
              }
            }
            
            @page {
              margin: 0.5in;
              size: letter;
            }
          </style>
        </head>
        <body>
          <div class="page-header">
            <h1>Medication Barcode Labels</h1>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="label-grid">
            ${medsWithBarcodes.map(med =>
        Array.from({ length: 12 }, () => `
                <div class="label">
                  <div class="med-info">
                    <div class="med-name">${med.genericName || med.brandName}</div>
                    <div class="med-details">
                      ID: ${med.id}
                    </div>
                  </div>
                  <div class="barcode-container">
                    ${med.barcodeDataUrl}
                  </div>
                </div>
              `).join('')
      ).join('')}
          </div>
        </body>
        </html>
      `

      // Write to print window and trigger print
      printWindow.document.write(printHTML)
      printWindow.document.close()

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }

    } catch (error) {
      console.error('Error generating barcodes:', error)
      alert('Error generating barcodes. Please try again.')
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="flex flex-col bg-neutral-100 flex-1 gap-2 p-2 pb-0 h-[calc(100vh-4rem)]">
      <button
        onClick={printBarcodes}
        className="bg-blue-500 text-white w-fit px-4 py-2 rounded hover:bg-blue-600"
      >
        {isPrinting ? "Printing..." : "Print Barcodes"}
      </button>
      <div className="flex flex-col h-full px-2 py-3 gap-3 overflow-y-auto border border-gray-300 rounded-t-lg inset-shadow-sm">
        {allMedications.map((med) => {
          const isSelected = selected.includes(med.id);

          return (
            <AdminMedCard key={med.id} isSelected={isSelected} medication={med} onSelectionChange={handleMedChange} />
          )
        })}

      </div>

    </div>
  )
}

export default Formulary