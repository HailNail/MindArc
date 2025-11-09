import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  TextField,
  Tooltip,
} from "@radix-ui/themes";

interface CategoryProps {
  disableDelete?: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDelete?: () => Promise<void>;
  closeDialog?: () => void;
  originalName?: string;
}

const CategoryForm = ({
  disableDelete,
  value,
  setValue,
  buttonText,
  handleSubmit,
  handleDelete,
  closeDialog,
  originalName,
}: CategoryProps) => {
  const trimmedValue = value.trim();
  const isNameEmpty = trimmedValue.length === 0;
  const isUnchanged =
    originalName?.toLowerCase().trim() === trimmedValue.toLowerCase();
  const disableSubmit = isNameEmpty || isUnchanged;
  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="2" py="2" wrap="wrap">
        <Box width={{ initial: "100vw", md: "300px" }}>
          <TextField.Root
            type="text"
            id="name"
            radius="medium"
            mt="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter category name"
          >
            <TextField.Slot pl="1"></TextField.Slot>
          </TextField.Root>
        </Box>
        <Flex justify="end" gapX="2">
          <Tooltip
            content={
              isNameEmpty
                ? "Category name cannot be empty"
                : isUnchanged
                ? "No changes to update"
                : buttonText === "Submit"
                ? "Create new category"
                : "Apply changes"
            }
          >
            <Button
              type="submit"
              radius="medium"
              my="1"
              disabled={disableSubmit}
            >
              {buttonText}
            </Button>
          </Tooltip>
          {handleDelete && (
            <Tooltip
              content={
                disableDelete
                  ? "This category is used by products and cannot be deleted"
                  : "Delete category"
              }
            >
              <Button
                onClick={async () => {
                  await handleDelete();
                  closeDialog?.();
                }}
                type="button"
                variant="soft"
                color="red"
                radius="medium"
                my="1"
                disabled={disableDelete}
              >
                Delete
              </Button>
            </Tooltip>
          )}

          {closeDialog && (
            <Box position="absolute" top="4" right="4">
              <Tooltip content="Close dialog without saving">
                <IconButton
                  variant="ghost"
                  color="ruby"
                  onClick={closeDialog}
                  type="button"
                >
                  <Cross2Icon className="h-6 w-6" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Flex>
    </form>
  );
};

export default CategoryForm;
