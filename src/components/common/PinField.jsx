import { useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Segmented 6-digit PIN entry built on Chakra's PinInput.
 *
 * Digits are masked by default and revealed with the eye toggle. `onChange`
 * receives the combined string value (digits only, capped at `length`).
 */
const PinField = ({
  label,
  value,
  onChange,
  length = 6,
  isRequired = true,
  autoFocus = false,
  labelColor = "red.600",
  focusBorderColor = "red.400",
  size = "md",
  fieldProps = {},
  iconColor = "gray.500",
}) => {
  const [show, setShow] = useState(false);

  return (
    <FormControl isRequired={isRequired}>
      {label ? (
        <FormLabel color={labelColor} fontWeight="medium">
          {label}
        </FormLabel>
      ) : null}
      <HStack spacing={2} align="center">
        <HStack spacing={2} flex="1">
          <PinInput
            value={value}
            onChange={onChange}
            mask={!show}
            type="number"
            otp={false}
            manageFocus
            placeholder=""
            size={size}
            focusBorderColor={focusBorderColor}
            autoFocus={autoFocus}
          >
            {Array.from({ length }).map((_, i) => (
              <PinInputField key={i} fontWeight="600" {...fieldProps} />
            ))}
          </PinInput>
        </HStack>
        <IconButton
          type="button"
          aria-label={show ? "Hide PIN" : "Show PIN"}
          variant="ghost"
          size="sm"
          onClick={() => setShow((s) => !s)}
          icon={<Icon as={show ? FiEyeOff : FiEye} color={iconColor} />}
        />
      </HStack>
    </FormControl>
  );
};

PinField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  length: PropTypes.number,
  isRequired: PropTypes.bool,
  autoFocus: PropTypes.bool,
  labelColor: PropTypes.string,
  focusBorderColor: PropTypes.string,
  size: PropTypes.string,
  fieldProps: PropTypes.object,
  iconColor: PropTypes.string,
};

export default PinField;
