import { FormContextProvider } from "@/context/FormContext"
const FormLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <FormContextProvider>
      {children}
    </FormContextProvider>
  )
}

export default FormLayout