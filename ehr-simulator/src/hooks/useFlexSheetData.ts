// custom hook, made FlexSheet very slow so this code is still in FlexSheet


import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store/store';
import { calculateColTotal } from '@/app/simulation/[sessionId]/chart/charting/page';
import type { tableData } from '@/app/simulation/[sessionId]/chart/charting/components/flexSheetData';

export function useFlexSheetData(chartingData: tableData[] = [], timeOffsets: number[] = []) {
    const editableData = useSelector((state: RootState) => state.flexSheet.editableData);
    const fieldSelections = useSelector((state: RootState) => state.flexSheet.fieldSelections);

    const visibleSubsetIds = useMemo(() => {
        const combinedSet = new Set<string>();
        Object.values(fieldSelections).forEach(selectedIdsArray => {
            selectedIdsArray.forEach(id => id !== "WDL" && combinedSet.add(id));
        });
        return combinedSet;
    }, [fieldSelections]);

    const filteredData = useMemo(() => {
        const currentDataToFilter = editableData.length > 0 ? editableData : chartingData;
        // Group rows by their toolName to calculate totals
        const groupedByTool: Record<string, tableData[]> = {};
        
        currentDataToFilter.forEach(row => {
            if (row.toolName) {
                groupedByTool[row.toolName] = groupedByTool[row.toolName] || [];
                groupedByTool[row.toolName].push(row);
            }
        });

        const newFilteredData: tableData[] = [];
        currentDataToFilter.forEach(row => {
            // Include hideable rows if their hideableId is in visibleSubsetIds
            const isVisible = !row.hideable || (row.hideableId && visibleSubsetIds.has(row.hideableId));
            if (isVisible) {
                newFilteredData.push(row);
            }
            
            // Handling assessment tools with numeric score totals
            // After adding all rows for a specific tool, add the total score row  
            if (row.rowType === "titleRow" && row.hideableId && visibleSubsetIds.has(row.hideableId)) {
                const toolName = row.hideableId;
                if (groupedByTool[toolName]) {
                    const totalRow = calculateColTotal(toolName, groupedByTool[toolName], timeOffsets);
                    newFilteredData.push(totalRow);
                }
            }
        });
        return newFilteredData;
    }, [visibleSubsetIds, editableData, chartingData, timeOffsets]);

    return { filteredData, editableData, fieldSelections, visibleSubsetIds };
}