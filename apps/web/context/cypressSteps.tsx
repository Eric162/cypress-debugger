import { orderBy } from "lodash";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useCypressSteps } from "../hooks/useCypressSteps";
import { CypressStep } from "../types";
import { isoDateToTimestamp } from "../utils/isoDateToTimestamp";

export type CypressStepsContextType = {
  steps: CypressStep[];
  activeStep: number;
  activeStepObj: CypressStep | null;
  setActiveStep: (i: number) => void;
};

const CypressStepsContext = createContext<CypressStepsContextType>({
  steps: [],
  activeStep: -1,
  activeStepObj: null,
  setActiveStep: (i: number) => {},
});

export const useCypressStepsContext = () => useContext(CypressStepsContext);

export default function CypressStepsContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { cypressSteps, loading } = useCypressSteps();
  const [activeStep, setActiveStep] = useState(-1);

  const orderedSteps = orderBy(cypressSteps, (step) => step.timestamp, "asc");

  const activeStepObj =
    activeStep === -1 ? null : orderedSteps[activeStep] ?? null;

  return (
    <CypressStepsContext.Provider
      value={{
        steps: orderedSteps,
        activeStep,
        setActiveStep,
        activeStepObj
      }}
    >
      {children}
    </CypressStepsContext.Provider>
  );
}
