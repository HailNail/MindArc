import { Box, Flex, Progress, Text } from "@radix-ui/themes";
import React from "react";
import { FaCheckCircle, FaDotCircle, FaRegCircle } from "react-icons/fa";

interface ProgressStepsProps {
  step1: boolean;
  step2?: boolean;
  step3?: boolean;
}

const ProgressSteps = ({ step1, step2, step3 }: ProgressStepsProps) => {
  const steps = [
    { label: "Login", isCompleted: step1 },
    { label: "Shipping", isCompleted: step2 },
    { label: "Summary", isCompleted: step3 },
  ].filter((step) => step.label);

  // Find the index of the first incomplete step, which is the currently active step.
  const currentStepIndex = steps.findIndex((step) => !step.isCompleted);
  const isAllCompleted = currentStepIndex === -1;
  const activeStepIndex = isAllCompleted ? steps.length - 1 : currentStepIndex;

  return (
    <Flex gap="2" align="center" py="4">
      {steps.map((step, index) => {
        const isCurrent = index === activeStepIndex;
        const isCompleted = step.isCompleted;
        // Checks if the line *before* the current step is the one that should be filling.
        // The progress bar at index 'i' connects step[i] to step[i+1].
        const nextStepIsActive =
          index < steps.length - 1 && index + 1 === activeStepIndex;

        const activeColor = "var(--accent-9)";
        const inactiveColor = "var(--gray-7)";
        return (
          <React.Fragment key={step.label}>
            <Flex direction="column" align="center" gap="1">
              {/* ICON */}
              <Box
                style={{
                  color: isCompleted || isCurrent ? activeColor : inactiveColor,
                  fontSize: "1.25rem",
                }}
              >
                {isCompleted ? (
                  <FaCheckCircle />
                ) : isCurrent ? (
                  <FaDotCircle />
                ) : (
                  <FaRegCircle />
                )}
              </Box>
              {/* LABEL */}
              <Text
                size="2"
                weight={isCurrent ? "bold" : "regular"}
                style={{
                  color: isCompleted || isCurrent ? activeColor : inactiveColor,
                }}
              >
                {step.label}
              </Text>
            </Flex>
            {/* Only render the connector if it's not the last step */}
            {index < steps.length - 1 && (
              <Box width={{ initial: "2rem", md: "8rem" }}>
                <Progress
                  size="1"
                  value={nextStepIsActive ? null : isCompleted ? 100 : 0}
                  radius="medium"
                  duration="10s"
                />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

export default ProgressSteps;
