import { useRef } from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

/**
 * Reusable confirmation dialog for destructive actions. Keeps the "are you
 * sure?" guard consistent across the admin portal.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColorScheme = "red",
  isLoading = false,
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay backdropFilter="blur(2px)">
        <AlertDialogContent borderRadius="16px" mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" pt={5}>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody fontSize="sm" color="gray.600">
            {body}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button
              colorScheme={confirmColorScheme}
              onClick={onConfirm}
              isLoading={isLoading}
              ml={3}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  body: PropTypes.node,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmColorScheme: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ConfirmDialog;
