import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Spinner,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { ImagePlus } from "lucide-react";
import { URL as API_URL } from "../../context/url";

const initialForm = {
  title: "",
  sortOrder: 0,
  isActive: true,
};

const sortPromotions = (items) =>
  [...items].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const token = useMemo(() => localStorage.getItem("token"), []);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/promotions/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions(sortPromotions(data.promotions ?? []));
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch promotions.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, token]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return undefined;
    }

    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please select a promotion image.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("sortOrder", String(form.sortOrder));
    formData.append("isActive", String(form.isActive));
    formData.append("image", imageFile);

    try {
      setSaving(true);
      const { data } = await axios.post(`${API_URL}/promotions`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPromotions((prev) => sortPromotions([data.promotion, ...prev]));
      resetForm();
      toast({
        title: "Promotion added",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast({
        title: "Error",
        description: "Failed to create promotion.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePromotion = async (id, payload) => {
    try {
      const { data } = await axios.patch(`${API_URL}/promotions/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions((prev) =>
        sortPromotions(
          prev.map((promotion) =>
            promotion._id === id ? data.promotion : promotion
          )
        )
      );
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast({
        title: "Error",
        description: "Failed to update promotion.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deletePromotion = async (id) => {
    try {
      await axios.delete(`${API_URL}/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions((prev) =>
        prev.filter((promotion) => promotion._id !== id)
      );
      toast({
        title: "Promotion deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "Failed to delete promotion.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Promotions</Heading>
          <Text color="gray.600" mt={2}>
            Upload and manage promotional images shown in the mobile app.
          </Text>
        </Box>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Grid templateColumns={{ base: "1fr", md: "1.2fr 1fr" }} gap={6}>
                <VStack align="stretch" spacing={4}>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Summer collection offer"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Sort order</FormLabel>
                    <Input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          sortOrder: e.target.value,
                        }))
                      }
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center" gap={3}>
                    <Switch
                      isChecked={form.isActive}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                    <FormLabel mb={0}>Active</FormLabel>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Promotion image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                  </FormControl>

                  <HStack>
                    <Button
                      type="submit"
                      leftIcon={<ImagePlus size={18} />}
                      colorScheme="red"
                      isLoading={saving}
                    >
                      Add Promotion
                    </Button>
                    <Button variant="ghost" onClick={resetForm}>
                      Reset
                    </Button>
                  </HStack>
                </VStack>

                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="gray.100"
                  minH="220px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Promotion preview"
                      objectFit="cover"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <Text color="gray.500">Image preview</Text>
                  )}
                </Box>
              </Grid>
            </form>
          </CardBody>
        </Card>

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner size="lg" />
          </Flex>
        ) : promotions.length === 0 ? (
          <Card>
            <CardBody>
              <Text color="gray.600">No promotions added yet.</Text>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            {promotions.map((promotion) => (
              <Card key={promotion._id} overflow="hidden">
                <Image
                  src={promotion.imageUrl}
                  alt={promotion.title || "Promotion"}
                  height="220px"
                  objectFit="cover"
                />
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between" align="flex-start" gap={4}>
                      <Box>
                        <Heading size="sm">
                          {promotion.title || "Untitled promotion"}
                        </Heading>
                      </Box>
                      <Badge colorScheme={promotion.isActive ? "green" : "gray"}>
                        {promotion.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Flex>

                    <FormControl>
                      <FormLabel fontSize="sm">Sort order</FormLabel>
                      <Input
                        type="number"
                        size="sm"
                        defaultValue={promotion.sortOrder ?? 0}
                        onBlur={(e) => {
                          const nextSortOrder = Number(e.target.value);
                          if (nextSortOrder === promotion.sortOrder) return;
                          updatePromotion(promotion._id, {
                            sortOrder: nextSortOrder,
                          });
                        }}
                      />
                    </FormControl>

                    <HStack justify="space-between">
                      <HStack>
                        <Switch
                          isChecked={promotion.isActive}
                          onChange={(e) =>
                            updatePromotion(promotion._id, {
                              isActive: e.target.checked,
                            })
                          }
                        />
                        <Text fontSize="sm">Show in app</Text>
                      </HStack>
                      <IconButton
                        aria-label="Delete promotion"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => deletePromotion(promotion._id)}
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
}

export default Promotions;
