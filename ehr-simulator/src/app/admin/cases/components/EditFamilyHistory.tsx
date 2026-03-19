'use client'
import { useState, useRef } from "react"
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { type CaseFamilyHistoryRow } from "../types"
import { type LookupRow } from "@/actions/cases"

interface CaseFamilyHistoryProps {
  rows: CaseFamilyHistoryRow[]
  relationshipOptions: LookupRow[]
  onAdd: (entry: { relationship_id: string; condition: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function EditFamilyHistory({ rows, relationshipOptions, onAdd, onDelete }: CaseFamilyHistoryProps) {
  const [relationshipId, setRelationshipId] = useState('')
  const [condition, setCondition] = useState('')
  const [saving, setSaving] = useState(false)
  const conditionRef = useRef<HTMLInputElement>(null)

  const handleAdd = async () => {
    if (!relationshipId || !condition.trim()) return
    setSaving(true)
    await onAdd({ relationship_id: relationshipId, condition: condition.trim() })
    setRelationshipId('')
    setCondition('')
    setSaving(false)
    conditionRef.current?.focus()
  }

  const sortedRows = [...rows].sort((a, b) => {
    const nameA = relationshipOptions.find(o => o.id === a.relationship_id)?.name ?? ''
    const nameB = relationshipOptions.find(o => o.id === b.relationship_id)?.name ?? ''
    return nameA.localeCompare(nameB)
  })

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="space-y-1 w-full sm:w-48">
          <label className="text-xs font-medium text-slate-500">Relation</label>
          <Select value={relationshipId} onValueChange={setRelationshipId}>
            <SelectTrigger className="bg-white h-9 w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map(o => (
                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 flex-[2] w-full">
          <label className="text-xs font-medium text-slate-500">Condition / Disease</label>
          <Input
            ref={conditionRef}
            value={condition}
            onChange={e => setCondition(e.target.value)}
            placeholder="e.g. Type 2 Diabetes, Hypertension"
            className="bg-white h-9"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          />
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!relationshipId || !condition.trim() || saving}
          className="h-9 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-fit"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {sortedRows.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableBody>
              {sortedRows.map(row => (
                <TableRow key={row.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium w-1/3 py-2">
                    {relationshipOptions.find(o => o.id === row.relationship_id)?.name ?? row.relationship_id}
                  </TableCell>
                  <TableCell className="py-2 text-slate-600">{row.condition}</TableCell>
                  <TableCell className="text-right py-2 w-12">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer h-6 w-6 text-slate-400 hover:text-red-600"
                      onClick={() => onDelete(row.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic pl-1">No family history recorded.</p>
      )}
    </div>
  )
}