import { Box, Button, Flex, TextField } from "@radix-ui/themes";

interface CategoryProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDelete?: () => Promise<void>;
  closeDialog?: () => void;
}

const CategoryForm = ({
  value,
  setValue,
  buttonText,
  handleSubmit,
  handleDelete,
  closeDialog,
}: CategoryProps) => {
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
          <Button type="submit" variant="soft" radius="medium" my="1">
            {buttonText}
          </Button>

          {handleDelete && (
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
            >
              Delete
            </Button>
          )}
        </Flex>
      </Flex>
    </form>
  );
};

export default CategoryForm;
