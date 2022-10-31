import {
  Button,
  Container,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { FormEvent, useEffect, useState } from "react";
import FormItem from "../component/FormItem";
import Layout from "../component/Layout";
import { CustomNextPage } from "./_app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPost, deletePost, getPosts, updatePost } from "../services";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
export type PostFormData = Pick<Post, "title" | "description">;

const useModalForm = (
  callback: (variables: any) => Promise<any>,
  onClose: () => void
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(callback, {
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      onClose();
    },
  });

  return mutation;
};

type ModalFormProps = Pick<ModalProps, "isOpen" | "onClose"> & {
  initialValue: { title: string; description: string; id?: string };
  modalTitle: React.ReactNode;
  onSubmit: (data: PostFormData) => Promise<any>;
};

const useUpdateInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  return [value, setValue] as const;
};

const ModalForm = ({
  isOpen,
  onClose,
  initialValue,
  modalTitle,
  onSubmit,
}: ModalFormProps) => {
  const { isLoading, mutateAsync } = useModalForm(onSubmit, onClose);

  const [title, setTitle] = useUpdateInput(initialValue.title);
  const [description, setDescription] = useUpdateInput(
    initialValue.description
  );

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    const submitValues = { title, description } as PostFormData;

    mutateAsync(submitValues);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormItem label={"Title:"}>
              <Input
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </FormItem>
            <FormItem label={"Description:"}>
              <Input
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </FormItem>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} isLoading={isLoading} type="submit">
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  id,
}: Pick<ModalProps, "isOpen" | "onClose"> & {
  onDelete: (id: string) => Promise<any>;
  id: string;
}) => {
  const { isLoading, mutateAsync } = useModalForm(onDelete, onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure to delete this post ?</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            isLoading={isLoading}
            onClick={() => mutateAsync(id)}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Post: CustomNextPage = (props: any) => {
  const { data } = useQuery(["posts"], getPosts);
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteodalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const [selectPostId, setSelectPostId] = useState("");
  const router = useRouter();
  const posts = data?.items || [];
  const selectPost = data?.items.find((post) => post._id === selectPostId);

  const changeTo = router.locale === "en" ? "en" : "vi";

  const { t } = useTranslation(["post"]);
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <Link href="/post" locale={changeTo}>
        <button>{t("change-locale", { changeTo })}</button>
      </Link>
      <Layout>
        <Container maxW="container.xl">
          <Button
            colorScheme="blue"
            style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
            onClick={onOpen}
          >
            {t("post:addButton")}
          </Button>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Post by</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {posts.map((post) => (
                  <Tr key={post._id}>
                    <Td>{post.title}</Td>
                    <Td>{post.description}</Td>
                    <Td>{post.owner?.name || "Anomyous"}</Td>
                    <Td>
                      {props.permissionsList.canReadOwn.grant}
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Edit Post"
                          icon={<EditIcon />}
                          colorScheme="green"
                          onClick={() => {
                            onEditModalOpen();
                            setSelectPostId(post._id);
                          }}
                        />
                        <IconButton
                          aria-label="Delete Post"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => {
                            onDeleteodalOpen();
                            setSelectPostId(post._id);
                          }}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
        <ModalForm
          isOpen={isOpen}
          onClose={onClose}
          initialValue={{ title: "", description: "" }}
          modalTitle={"Add post"}
          onSubmit={addPost}
        />
        <ModalForm
          isOpen={isEditModalOpen}
          onClose={() => {
            onEditModalClose();
            setSelectPostId("");
          }}
          initialValue={{
            title: selectPost?.title || "",
            description: selectPost?.description || "",
          }}
          modalTitle={"Update post"}
          onSubmit={(data) => updatePost({ ...data, id: selectPostId })}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            onDeleteModalClose();
            setSelectPostId("");
          }}
          onDelete={deletePost}
          id={selectPostId}
        />
      </Layout>
    </>
  );
};

export default Post;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["post"])),
      // Will be passed to the page component as props
    },
  };
}

Post.auth = {
  schema: (query) => ({
    canReadAny: query.readAny("post"),
    canReadOwn: query.readOwn("post"),
  }),
};
