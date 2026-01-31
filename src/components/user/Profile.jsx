import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Input, 
  Spinner, 
  Text, 
  Heading, 
  Flex,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Avatar,
  Fade,
  ScaleFade,
  SlideFade,
  InputGroup,
  InputRightElement,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SearchIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

// Mock API service
const mockApiService = {
  updateUserProfile: (userId, userData, token) => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        console.log('API call to update user:', userId, userData);
        resolve({ success: true, data: userData });
      }, 800);
    });
  }
};

const MotionBox = motion(Box);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUser, setFilteredUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedField, setSelectedField] = useState(null);

  // Fetch user data from localStorage (token)
  useEffect(() => {
    const fetchProfileFromLocalStorage = () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
          const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiam9iVGl0bGUiOiJTb2Z0d2FyZSBFbmdpbmVlciIsImxvY2F0aW9uIjoiU2FuIEZyYW5jaXNjbywgQ0EiLCJwaG9uZSI6IisxIDIzNC01NjctODkwMCIsImF2YXRhclVybCI6Imh0dHBzOi8vYXBpLnBsYWNlaG9sZGVyLmNvbS80MDAvNDAwIn0.qwertyuiopasdfghjklzxcvbnm1234567890';
          
          if (token) {
            try {
              // Parse the token (for JWT, parsing payload)
              const userInfo = JSON.parse(atob(token.split('.')[1]));
              setUser(userInfo);
              setFilteredUser(userInfo);
            } catch (e) {
              // Fallback mock data if token parsing fails
              const mockUser = {
                id: "123",
                name: "John Doe",
                email: "john@example.com",
                role: "user",
                jobTitle: "Software Engineer",
                location: "San Francisco, CA",
                phone: "+1 234-567-8900",
                avatarUrl: "https://api.placeholder.com/400/400"
              };
              setUser(mockUser);
              setFilteredUser(mockUser);
            }
          }
          setIsLoading(false);
        }, 1200);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        toast({
          title: 'Error loading profile',
          description: 'Could not load your profile information.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProfileFromLocalStorage();
  }, [toast]);

  // Filter user data based on search term
  useEffect(() => {
    if (!user) return;
    
    if (searchTerm) {
      const filteredData = Object.entries(user)
        .filter(([key, value]) =>
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      setFilteredUser(filteredData);
    } else {
      setFilteredUser(user);
    }
  }, [searchTerm, user]);

  // Handle edit field click
  const handleEditClick = (key, value) => {
    setEditingField(key);
    setEditValue(value);
  };

  // Handle save field
  const handleSaveField = async () => {
    setIsSaving(true);
    try {
      // Get token for API call
      const token = localStorage.getItem('token');
      
      // Update the field in the user object
      const updatedUser = { ...user, [editingField]: editValue };
      
      // Make API call to update the user profile
      const result = await mockApiService.updateUserProfile(user.id, updatedUser, token);
      
      if (result.success) {
        // Update local state
        setUser(updatedUser);
        setFilteredUser(updatedUser);
        setEditingField(null);
        
        // Show success toast
        toast({
          title: 'Updated successfully',
          description: `Your ${editingField} has been updated.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update your profile information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingField(null);
  };

  // Open modal to view/edit field details
  const handleFieldClick = (key, value) => {
    if (key === 'id' || key === 'avatarUrl') return; // Don't allow editing of these fields
    
    setSelectedField({ key, value });
    setEditValue(value);
    onOpen();
  };

  // Update field from modal
  const handleUpdateFromModal = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updatedUser = { ...user, [selectedField.key]: editValue };
      
      const result = await mockApiService.updateUserProfile(user.id, updatedUser, token);
      
      if (result.success) {
        setUser(updatedUser);
        setFilteredUser(updatedUser);
        
        toast({
          title: 'Updated successfully',
          description: `Your ${selectedField.key} has been updated.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update your profile information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Flex 
        justify="center" 
        align="center" 
        minHeight="100vh" 
        bg="gray.900"
        direction="column"
        gap={4}
      >
        <Spinner 
          size="xl" 
          color="blue.400" 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.700"
        />
        <Text color="blue.300" fontSize="lg" mt={4}>Loading your profile...</Text>
      </Flex>
    );
  }

  // If no user data found
  if (!user) {
    return (
      <Flex 
        justify="center" 
        align="center" 
        minHeight="100vh" 
        bg="gray.900"
        direction="column"
      >
        <Heading color="red.400">No Profile Found</Heading>
        <Text color="gray.400" mt={2}>Please login to view your profile.</Text>
      </Flex>
    );
  }

  // Format display field value
  const formatFieldValue = (key, value) => {
    if (key === 'avatarUrl') return null;
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  // Get display name for field
  const getFieldDisplayName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Get field color based on type
  const getFieldColor = (key) => {
    const keyTypes = {
      id: "purple",
      email: "green",
      role: "blue",
      name: "orange",
      jobTitle: "cyan",
      location: "yellow",
      phone: "pink"
    };
    
    return keyTypes[key] || "gray";
  };

  // Main render
  return (
    <Box 
      p={0} 
      bg="gray.900" 
      minHeight="100vh" 
      color="white"
      transition="all 0.3s ease"
    >
      <Flex 
        direction="column" 
        maxWidth="1200px" 
        margin="0 auto" 
        p={{ base: 4, md: 8 }}
      >
        {/* Header section */}
        <ScaleFade in={true} initialScale={0.9}>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align={{ base: "center", md: "flex-start" }} 
            justify="space-between"
            mb={8}
          >
            <Box textAlign={{ base: "center", md: "left" }}>
              <Heading 
                as="h1" 
                mb={2} 
                bgGradient="linear(to-r, blue.400, teal.300)" 
                bgClip="text" 
                fontSize={{ base: "3xl", md: "4xl" }}
                letterSpacing="tight"
              >
                User Profile
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Manage your account information
              </Text>
            </Box>
            
            <Avatar 
              size="2xl" 
              name={user.name} 
              src={user.avatarUrl || "/api/placeholder/400/400"} 
              bg="blue.500"
              border="4px solid"
              borderColor="blue.500"
              mt={{ base: 4, md: 0 }}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            />
          </Flex>
        </ScaleFade>
        
        {/* Search input */}
        <SlideFade in={true} offsetY="20px">
          <InputGroup 
            size="lg" 
            mb={6}
            width={{ base: "100%", md: "60%" }}
            mx="auto"
          >
            <Input
              type="text"
              placeholder="Search profile information..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ 
                borderColor: "blue.400", 
                boxShadow: "0 0 0 1px #4299E1" 
              }}
              borderRadius="full"
              pl={6}
              pr={12}
              _placeholder={{ color: "gray.500" }}
              transition="all 0.3s ease"
            />
            <InputRightElement width="4rem">
              <SearchIcon color="blue.400" />
            </InputRightElement>
          </InputGroup>
        </SlideFade>

        {/* Profile information */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          bg="gray.800"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
          border="1px solid"
          borderColor="gray.700"
        >
          {user.name && (
            <Flex 
              bg="gray.700" 
              p={6} 
              align="center"
              borderBottom="1px solid"
              borderColor="gray.600"
            >
              <Heading size="lg" fontWeight="600">{user.name}</Heading>
              {user.role && (
                <Badge ml={4} colorScheme="blue" fontSize="0.8em" px={3} py={1} borderRadius="full">
                  {user.role}
                </Badge>
              )}
            </Flex>
          )}
          
          <Box p={6}>
            {filteredUser && Object.keys(filteredUser).length > 0 ? (
              Object.entries(filteredUser)
                .filter(([key]) => key !== 'name' && key !== 'role') // Already displayed in header
                .map(([key, value]) => (
                  <Fade in={true} key={key}>
                    <Box 
                      p={4} 
                      mb={3}
                      bg="gray.700"
                      borderRadius="lg"
                      position="relative"
                      transition="all 0.2s ease"
                      _hover={{ 
                        bg: "gray.600", 
                        transform: key !== 'id' && key !== 'avatarUrl' ? "translateX(5px)" : "none",
                        cursor: key !== 'id' && key !== 'avatarUrl' ? "pointer" : "default" 
                      }}
                      onClick={() => handleFieldClick(key, value)}
                    >
                      {editingField === key ? (
                        <Flex align="center">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            mr={2}
                            bg="gray.800"
                            autoFocus
                          />
                          <IconButton
                            icon={<CheckIcon />}
                            colorScheme="green"
                            size="sm"
                            mr={1}
                            isLoading={isSaving}
                            onClick={handleSaveField}
                            aria-label="Save"
                          />
                          <IconButton
                            icon={<CloseIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={handleCancelEdit}
                            aria-label="Cancel"
                          />
                        </Flex>
                      ) : (
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text 
                              fontSize="sm" 
                              fontWeight="bold" 
                              color={`${getFieldColor(key)}.300`}
                              textTransform="uppercase"
                              letterSpacing="wider"
                              mb={1}
                            >
                              {getFieldDisplayName(key)}
                            </Text>
                            
                            <Text fontSize="md">
                              {formatFieldValue(key, value) || '-'}
                            </Text>
                          </Box>
                          
                          {key !== 'id' && key !== 'avatarUrl' && (
                            <IconButton
                              aria-label="Edit"
                              icon={<EditIcon />}
                              variant="ghost"
                              colorScheme="blue"
                              size="sm"
                              opacity={0.6}
                              _hover={{ opacity: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(key, value);
                              }}
                            />
                          )}
                        </Flex>
                      )}
                    </Box>
                  </Fade>
                ))
            ) : (
              <ScaleFade initialScale={0.9} in={true}>
                <Box 
                  p={8} 
                  textAlign="center" 
                  bg="gray.700" 
                  borderRadius="lg"
                >
                  <Text fontSize="lg" color="gray.400">
                    No matching profile information found.
                  </Text>
                </Box>
              </ScaleFade>
            )}
          </Box>
        </MotionBox>
      </Flex>

      {/* Edit Field Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(3px)" />
        <ModalContent bg="gray.800" color="white" borderRadius="xl">
          <ModalHeader>
            {selectedField && getFieldDisplayName(selectedField.key)}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            {selectedField && (
              <FormControl>
                <FormLabel>Update your {selectedField.key}</FormLabel>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400" }}
                />
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateFromModal} isLoading={isSaving}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile;