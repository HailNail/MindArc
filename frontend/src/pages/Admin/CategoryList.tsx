import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import type { CustomFetchError } from "../../types/hooks";
import type { Category } from "../../types/categoryTypes";

import { toast } from "react-toastify";
import {
  Flex,
  Box,
  Separator,
  Button,
  Heading,
  Dialog,
  Container,
} from "@radix-ui/themes";
import CategoryForm from "../../components/CategoryForm";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [updateName, setUpdateName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const res = await createCategory({ name }).unwrap();
      toast.success(`Category "${res.name}" created successfully`);
      setName("");
    } catch (error) {
      console.error(error);
      toast.error("Could not create category");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateName) {
      toast.error("Category name cannot be empty");
      return;
    }

    if (!selectedCategory) {
      toast.error("No category selected for update");
      return;
    }

    try {
      const res = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updateName,
        },
      }).unwrap();
      toast.success(`Category "${res.name}" updated successfully`);
      setUpdateName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      toast.error("No category selected for delete");

      return;
    }
    try {
      const res = await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`Category "${res.name}" deleted successfully`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not delete category");
    }
  };

  return (
    <Container ml={{ initial: "0", md: "4rem", xl: "0" }} mt="7">
      <Flex
        direction={{ initial: "column", md: "row" }}
        gap="4"
        justify="center"
        align="start"
      >
        <Box width={{ initial: "100vw", md: "75vw" }} p="4">
          <AdminMenu />
          <Heading>Manage Categories</Heading>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Submit"
          />
          <Separator size="4" />
          <Flex wrap="wrap" gapX="3" py="2">
            <Dialog.Root open={modalVisible} onOpenChange={setModalVisible}>
              {categories?.map((category) => (
                <Box key={category._id}>
                  <Dialog.Trigger>
                    <Button
                      variant="outline"
                      radius="medium"
                      my="1"
                      onClick={() => {
                        setSelectedCategory(category);
                        setUpdateName(category.name);
                        setModalVisible(true);
                      }}
                    >
                      {category.name}
                    </Button>
                  </Dialog.Trigger>
                </Box>
              ))}
              <Dialog.Content maxWidth="450px">
                <Dialog.Title>Edit Category</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Make changes to your category
                </Dialog.Description>

                <CategoryForm
                  value={updateName}
                  setValue={(value) => setUpdateName(value)}
                  handleSubmit={async (e) => {
                    await handleUpdateCategory(e);
                    setModalVisible(false);
                  }}
                  handleDelete={async () => {
                    await handleDeleteCategory();
                    setModalVisible(false);
                  }}
                  buttonText="Update"
                  closeDialog={() => setModalVisible(false)}
                />
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default CategoryList;
