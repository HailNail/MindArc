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
    <Container ml={{ initial: "0", md: "4rem", xl: "0" }} mt="7">
      <Flex direction={{ initial: "column", md: "row" }}>
        <AdminMenu />
        <Box width={{ md: "75%" }} p="3">
          <Heading mb="3">Create Product</Heading>

          {image && (
            <Box mb="2">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </Box>
          )}
          <label className="cursor-pointer">
            <Box
              mb="3"
              display="block"
              py="8"
              className="border-2 border-dotted rounded-lg text-center "
            >
              <Text align="center" weight="bold">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                />
              </Text>
            </Box>
          </label>
          <Box>
            <Flex wrap="wrap">
              <Box>
                <Text as="label" htmlFor="name">
                  Name
                </Text>{" "}
                <TextField.Root
                  type="text"
                  radius="medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                >
                  <TextField.Slot pl="1"></TextField.Slot>
                </TextField.Root>
              </Box>
              <Box ml="4">
                <Text as="label" htmlFor="name block">
                  Price
                </Text>{" "}
                <TextField.Root
                  type="number"
                  radius="medium"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                >
                  <TextField.Slot pl="1"></TextField.Slot>
                </TextField.Root>
              </Box>
            </Flex>
            <Flex wrap="wrap" my="2">
              <Box>
                <Text as="label" htmlFor="name block">
                  Quantity
                </Text>{" "}
                <TextField.Root
                  type="number"
                  radius="medium"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                >
                  <TextField.Slot pl="1"></TextField.Slot>
                </TextField.Root>
              </Box>
              <Box ml="4">
                <Text as="label" htmlFor="name block">
                  Brand
                </Text>{" "}
                <TextField.Root
                  type="text"
                  radius="medium"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <TextField.Slot pl="1"></TextField.Slot>
                </TextField.Root>
              </Box>
            </Flex>
            <Text as="label">Description</Text>
            <TextArea
              mb="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></TextArea>

            <Flex>
              <Box>
                <Text as="label" htmlFor="name block">
                  Count In Stock
                </Text>
                <TextField.Root
                  type="text"
                  radius="medium"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                >
                  <TextField.Slot pl="1"></TextField.Slot>
                </TextField.Root>
              </Box>
              <Box ml="4">
                <Text as="label">Category</Text> <br />
                <Select.Root value={category} onValueChange={setCategory}>
                  <Select.Trigger placeholder="Category" />
                  <Select.Content position="popper">
                    <Select.Group>
                      {categories?.map((c) => (
                        <Select.Item key={c._id} value={c._id}>
                          {c.name}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
            <Button onClick={handleSubmit} mt="4">
              Submit
            </Button>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default ProductList;
