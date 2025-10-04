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
    <Container ml={{ initial: "0", sm: "11rem" }} mt="4">
      <Flex direction={{ initial: "column", md: "row" }}>
        <AdminMenu />
        <Box width={{ md: "75%" }} p="3">
          <Heading mb="3">Update / Delete Product</Heading>

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
                {file ? file.name : "Upload Image "}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={`${image && "hidden"}`}
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
                  type="number"
                  radius="medium"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                >
                  <TextField.Slot pl="1"></TextField.Slot>
                </TextField.Root>
              </Box>
              <Box ml="4">
                <Text>Category</Text> <br />
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
            <Box mt="4">
              <Button onClick={handleSubmit} mr="6" variant="soft">
                Update
              </Button>
              <Button onClick={handleDelete} color="ruby" variant="soft">
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default ProductUpdate;
