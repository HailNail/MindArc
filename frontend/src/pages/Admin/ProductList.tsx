import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import type { CustomFetchError } from "../../types/hooks";
import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  TextField,
  TextArea,
  Select,
  Button,
} from "@radix-ui/themes";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(
        (error as CustomFetchError).data?.message || "Failed to update user"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
        image: image,
      };
      console.log("Payload to backend:", productData);
      const data = await createProduct(productData).unwrap();
      toast.success(`${data.name} created successfully`);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try again please");
    }
  };

  return (
    <Container ml={{ initial: "0", md: "4rem" }} mt="7" size="3">
      <Flex>
        <AdminMenu />

        <Box p={{ initial: "3", md: "5" }} flexGrow="1">
          <Heading as="h1" size="7" mb="5">
            Create New Product
          </Heading>

          {image && (
            <Box mb="4">
              <img
                src={image}
                alt="Product Preview"
                className="block mx-auto max-h-[250px] w-auto rounded-lg shadow-md"
              />
            </Box>
          )}
          <label className="cursor-pointer" style={{ width: "100%" }}>
            <Box
              mb="5"
              display="block"
              py="6"
              className="border-2 border-dotted border-[var(--gray-4)] hover:border-[var(--teal-5)] rounded-xl text-center transition-colors"
            >
              <Text weight="bold" color="gray">
                {image ? "Change Image" : "Click to select image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  style={{ display: "none" }}
                />
              </Text>
            </Box>
          </label>

          <Flex direction="column" gap="4">
            <Flex gap="4" wrap="wrap">
              <Box flexGrow="1" minWidth="15rem">
                <Text as="label" weight="bold" mb="1" htmlFor="name">
                  Name
                </Text>
                <TextField.Root
                  type="text"
                  radius="medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              <Box flexGrow="1" minWidth="15rem">
                <Text as="label" weight="bold" mb="1" htmlFor="price">
                  Price
                </Text>
                <TextField.Root
                  type="number"
                  radius="medium"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Box>
            </Flex>

            <Flex gap="4" wrap="wrap">
              <Box flexGrow="1" minWidth="15rem">
                <Text as="label" weight="bold" mb="1" htmlFor="quantity">
                  Quantity
                </Text>
                <TextField.Root
                  type="number"
                  radius="medium"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Box>
              <Box flexGrow="1" minWidth="15rem">
                <Text as="label" weight="bold" mb="1" htmlFor="brand">
                  Brand
                </Text>
                <TextField.Root
                  type="text"
                  radius="medium"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Box>
            </Flex>

            <Box>
              <Text as="label" weight="bold" mb="1">
                Description
              </Text>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </Box>

            <Flex gap="4" wrap="wrap">
              <Box flexGrow="1" minWidth="15rem">
                <Text as="label" weight="bold" mb="1">
                  Count In Stock
                </Text>
                <TextField.Root
                  type="text"
                  radius="medium"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </Box>
              <Flex direction="column" flexGrow="1" minWidth="15rem">
                <Text as="label" weight="bold">
                  Category
                </Text>

                <Select.Root value={category} onValueChange={setCategory}>
                  <Select.Trigger placeholder="Select Category" />
                  <Select.Content
                    position="popper"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    <Select.Group>
                      {categories?.map((c) => (
                        <Select.Item key={c._id} value={c._id}>
                          {c.name}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>

            <Button
              onClick={handleSubmit}
              mt="4"
              size="3"
              style={{ width: "100%" }}
            >
              Create Product
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default ProductList;
