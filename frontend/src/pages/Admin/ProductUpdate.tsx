import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import type { CustomFetchError } from "../../types/hooks";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
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

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id ?? "");

  const [image, setImage] = useState(productData?.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || "");

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData?.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

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

    if (!params._id) {
      toast.error("Product ID is missing.");
      return;
    }
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

      await updateProduct({
        productId: params._id,
        ...productData,
      }).unwrap();

      toast.success("Product successfully updated");
      navigate("/admin/allproducts");
    } catch (error) {
      console.error("Update failed:", error);

      const errorMessage =
        (error as CustomFetchError)?.data?.message ||
        "Failed to update product";

      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
      if (!params._id) {
        toast.error("Product ID is missing.");
        return;
      }
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data?.name}" is deleted`);
      navigate("/admin/allproducts");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed. Try again please.");
    }
  };

  return (
    <Container ml={{ initial: "0", md: "4rem" }} mt="7" size="3">
      <Flex>
        <AdminMenu />

        <Box p={{ initial: "3", md: "5" }} flexGrow="1">
          <Heading as="h1" size="7" mb="5">
            Update / Delete Product
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

            <Flex justify="between" mt="4" width="100%">
              <Button
                style={{ width: "45%" }}
                onClick={handleSubmit}
                mr="6"
                variant="soft"
              >
                Update
              </Button>
              <Button
                style={{ width: "45%" }}
                onClick={handleDelete}
                color="ruby"
                variant="soft"
              >
                Delete
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default ProductUpdate;
