import React from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Gradient Border Component
export const GradientBorder = ({ children, ...props }) => (
  <Box
    position="relative"
    p="6px"
    _before={{
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: "lg",
      padding: "6px",
      background: "linear-gradient(45deg, #FF0080, #FF0000, #FF8C00, #FFD700)",
      backgroundSize: "300% 300%",
      animation: `${gradientMove} 8s ease infinite`,
      mask:
        "linear-gradient(#fff 0 0) content-box," + "linear-gradient(#fff 0 0)",
      maskComposite: "exclude",
    }}
    {...props}
  >
    {children}
  </Box>
);

// Pulsing Border Component
export const PulsingBorder = ({ children, ...props }) => {
  const pulseKeyframes = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(229, 62, 62, 0); }
    100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
  `;

  return (
    <Box
      position="relative"
      borderWidth="2px"
      borderColor="red.500"
      borderRadius="lg"
      animation={`${pulseKeyframes} 2s infinite`}
      {...props}
    >
      {children}
    </Box>
  );
};

// Shimmer Border Component
export const ShimmerBorder = ({ children, ...props }) => {
  const shimmerKeyframes = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  `;

  return (
    <Box
      position="relative"
      p="1px"
      background="linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)"
      backgroundSize="1000px 100%"
      animation={`${shimmerKeyframes} 8s infinite linear`}
      borderRadius="lg"
      {...props}
    >
      <Box bg="white" borderRadius="lg" height="100%" width="100%">
        {children}
      </Box>
    </Box>
  );
};

// Dashed Animated Border
export const DashedBorder = ({ children, ...props }) => {
  const dashKeyframes = keyframes`
    to {
      stroke-dashoffset: -1000;
    }
  `;

  return (
    <Box position="relative" {...props}>
      <Box
        as="svg"
        position="absolute"
        top="-2px"
        left="-2px"
        width="calc(100% + 4px)"
        height="calc(100% + 4px)"
        pointerEvents="none"
      >
        <Box
          as="rect"
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="8"
          fill="none"
          stroke="red.500"
          strokeWidth="2"
          strokeDasharray="10 5"
          animation={`${dashKeyframes} 20s linear infinite`}
        />
      </Box>
      {children}
    </Box>
  );
};

// Neon Border Component
export const NeonBorder = ({ children, ...props }) => (
  <Box
    position="relative"
    borderRadius="lg"
    _before={{
      content: '""',
      position: "absolute",
      top: "-2px",
      left: "-2px",
      right: "-2px",
      bottom: "-2px",
      background: "red.500",
      borderRadius: "lg",
      filter: "blur(8px)",
      opacity: 0.7,
      zIndex: -1,
    }}
    {...props}
  >
    <Box bg="white" borderRadius="lg" position="relative" zIndex="1">
      {children}
    </Box>
  </Box>
);

// Example usage component
export const BorderShowcase = () => (
  <Box spacing={8} p={4}>
    <GradientBorder mb={8}>
      <Box bg="white" p={4} borderRadius="lg">
        Gradient Border
      </Box>
    </GradientBorder>

    <PulsingBorder mb={8}>
      <Box p={4}>Pulsing Border</Box>
    </PulsingBorder>

    <ShimmerBorder mb={8}>
      <Box p={4}>Shimmer Border</Box>
    </ShimmerBorder>

    <DashedBorder mb={8}>
      <Box p={4}>Dashed Animated Border</Box>
    </DashedBorder>

    <NeonBorder>
      <Box p={4}>Neon Border</Box>
    </NeonBorder>
  </Box>
);
