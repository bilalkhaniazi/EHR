"use client"

import { useMemo, useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { useSimulationTime } from "../context/SimulationTimeContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

/** Step interval toward more recent timepoints (ms). */
const AUTOPLAY_INTERVAL_MS = 1750

function findCurrentIndex(
  offsets: number[],
  selected: number
): number {
  const exact = offsets.indexOf(selected)
  if (exact !== -1) return exact
  if (offsets.length === 0) return 0
  return offsets.reduce((bestIdx, t, i) => {
    const best = offsets[bestIdx]!
    return Math.abs(t - selected) < Math.abs(best - selected) ? i : bestIdx
  }, 0)
}

/**
 * Shared simulation timepoint selector. Options come from distinct
 * `lab_results.time_offset` values (same axis as imaging/micro via `lab_id`).
 *
 * Ordering: `availableTimeOffsets` is ascending (smaller offset = more recent).
 * - Previous → larger offset (earlier in simulated timeline)
 * - Next → smaller offset (more recent)
 * - Autoplay → steps Next-ward each tick; stops at most recent (index 0).
 */
export default function SimulationTimeSelector() {
  const {
    isLoading,
    availableTimeOffsets,
    selectedTimeOffset,
    setSelectedTimeOffset,
  } = useSimulationTime()

  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const availableTimeOffsetsRef = useRef(availableTimeOffsets)
  const selectedTimeOffsetRef = useRef(selectedTimeOffset)
  availableTimeOffsetsRef.current = availableTimeOffsets
  selectedTimeOffsetRef.current = selectedTimeOffset

  const currentIndex = useMemo(
    () => findCurrentIndex(availableTimeOffsets, selectedTimeOffset),
    [availableTimeOffsets, selectedTimeOffset]
  )

  const canGoPrevious =
    availableTimeOffsets.length > 0 &&
    currentIndex < availableTimeOffsets.length - 1
  const canGoNext = availableTimeOffsets.length > 0 && currentIndex > 0

  const canStartAutoplay =
    availableTimeOffsets.length >= 2 && currentIndex > 0

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const tick = useCallback(() => {
    const offsets = availableTimeOffsetsRef.current
    const sel = selectedTimeOffsetRef.current
    const i = findCurrentIndex(offsets, sel)

    if (i > 0) {
      setSelectedTimeOffset(offsets[i - 1]!)
    } else {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsPlaying(false)
    }
  }, [setSelectedTimeOffset])

  const startAutoplay = useCallback(() => {
    /** Avoid duplicate intervals (rapid double-click, Strict Mode quirks). */
    if (intervalRef.current != null) return

    const offsets = availableTimeOffsetsRef.current
    const sel = selectedTimeOffsetRef.current
    if (offsets.length < 2) return
    const i = findCurrentIndex(offsets, sel)
    if (i === 0) return

    setIsPlaying(true)
    intervalRef.current = setInterval(tick, AUTOPLAY_INTERVAL_MS)
  }, [tick])

  useEffect(() => {
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  /** Stop autoplay if timepoints disappear while playing. */
  useEffect(() => {
    if (isPlaying && availableTimeOffsets.length < 2) {
      stopAutoplay()
    }
  }, [isPlaying, availableTimeOffsets.length, stopAutoplay])

  const goPrevious = () => {
    stopAutoplay()
    if (!canGoPrevious) return
    setSelectedTimeOffset(availableTimeOffsets[currentIndex + 1]!)
  }

  const goNext = () => {
    stopAutoplay()
    if (!canGoNext) return
    setSelectedTimeOffset(availableTimeOffsets[currentIndex - 1]!)
  }

  const onSelectValue = (v: string) => {
    stopAutoplay()
    setSelectedTimeOffset(Number(v))
  }

  const toggleAutoplay = () => {
    if (isPlaying) {
      stopAutoplay()
    } else {
      startAutoplay()
    }
  }

  if (isLoading) {
    return (
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-lime-700/30 bg-lime-700/15 px-4 py-2">
        <p className="text-xs font-medium text-white/90">Simulation time</p>
        <span className="text-xs text-white/80">Loading…</span>
      </div>
    )
  }

  if (availableTimeOffsets.length === 0) {
    return (
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-lime-700/30 bg-lime-700/15 px-4 py-2">
        <Label htmlFor="sim-time-offset" className="text-xs font-medium text-white">
          Simulation time
        </Label>
        <span className="text-xs text-white/85">
          No lab timepoints yet — timeline will appear when lab results exist.
        </span>
      </div>
    )
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-lime-700/30 bg-lime-700/15 px-4 py-2">
      <Label htmlFor="sim-time-offset" className="text-xs font-medium text-white">
        Simulation time
      </Label>

      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Simulation timeline controls"
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 w-8 shrink-0 border-white/40 bg-white/90 p-0 text-slate-900 hover:bg-white disabled:opacity-40"
          onClick={goPrevious}
          disabled={!canGoPrevious}
          aria-label="Earlier timepoint (larger offset)"
          title="Earlier in simulation"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>

        <Select value={String(selectedTimeOffset)} onValueChange={onSelectValue}>
          <SelectTrigger
            id="sim-time-offset"
            size="sm"
            className="h-8 min-w-[140px] border-white/30 bg-white/90 text-slate-900"
          >
            <SelectValue placeholder="Select offset" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeOffsets.map((off) => (
              <SelectItem key={off} value={String(off)}>
                T − {off} min
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 w-8 shrink-0 border-white/40 bg-white/90 p-0 text-slate-900 hover:bg-white disabled:opacity-40"
          onClick={toggleAutoplay}
          disabled={isPlaying ? false : !canStartAutoplay}
          aria-label={isPlaying ? "Pause autoplay" : "Play toward more recent time"}
          title={isPlaying ? "Pause" : "Play toward more recent"}
        >
          {isPlaying ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="size-4" aria-hidden />
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 w-8 shrink-0 border-white/40 bg-white/90 p-0 text-slate-900 hover:bg-white disabled:opacity-40"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="More recent timepoint (smaller offset)"
          title="More recent"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
