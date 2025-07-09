import { Label } from "./ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"


const CheckBoxList = () => {
    return (
        <Popover>
        <PopoverTrigger asChild>
            <Button className="h-6 w-full rounded-none m-0 bg-transparent shadow-none hover:bg-muted/30 text-black p-0"></Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white p-0 shadow-md shadow-black/30 border rounded-xl">
            <Label className="hover:bg-accent/50 flex items-start gap-3 border-b p-2 has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                id="toggle-2"
                
                className="data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white dark:data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-blue-gray"
                />
                <p className="text-sm leading-none font-normal">
                    WDL
                </p>
            </Label>
            <Label className="bg-accent/50 flex items-start gap-3 border-b p-2 has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <p className="pl-4 text-sm leading-none font-normal">
                    WDL, except:
                </p>
            </Label>
            <Label className="hover:bg-accent/50 flex items-start gap-3 border-b p-2 has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                id="toggle-2"
                
                className="data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white dark:data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-blue-gray"
                />
                <p className="text-sm leading-none font-normal">
                    Lung Sounds
                </p>
            </Label>
            <Label className="hover:bg-accent/50 flex items-start gap-3 border-b p-2 has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                id="toggle-2"
                
                className="data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white dark:data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-blue-gray"
                />
                <p className="text-sm leading-none font-normal">
                    Cough
                </p>
            </Label>
            <Label className="hover:bg-accent/50 flex items-start gap-3 border-b p-2 has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                id="toggle-2"
                
                className="data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white dark:data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-blue-gray"
                />
                <p className="text-sm leading-none font-normal">
                    Rhythm/Pattern
                </p>
            </Label>
            <Label className="hover:bg-accent/50 flex items-start gap-3 p-2 has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                id="toggle-2"
                
                className="data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white dark:data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-blue-gray"
                />
                <p className="text-sm leading-none font-normal">
                    Effort/Expansion
                </p>
            </Label>
        </PopoverContent>
    </Popover>
    )
}

export default CheckBoxList