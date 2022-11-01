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
import { useTranslation } from "next-i18next";
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

  const { t } = useTranslation("post");

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
            <FormItem label={t("title") + ":"}>
              <Input
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </FormItem>
            <FormItem label={t("description") + ":"}>
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
            {t("addPostForm.save")}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {t("addPostForm.close")}
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

  const { t } = useTranslation("post");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("deletePostForm.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t("deletePostForm.question")}</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            isLoading={isLoading}
            onClick={() => mutateAsync(id)}
          >
            {t("deletePostForm.delete")}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {t("deletePostForm.close")}
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

  const { t } = useTranslation("post");
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <Layout>
        <Container maxW="container.xl">
          <Button
            colorScheme="blue"
            style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
            onClick={onOpen}
          >
            {t("addButton")}
          </Button>
          <h1>{t("totalPost", { count: posts?.length })}</h1>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("title")}</Th>
                  <Th>{t("description")}</Th>
                  <Th>{t("table.title.postBy")}</Th>
                  <Th>{t("table.title.action")}</Th>
                  <Th>{t("table.title.createdAt")}</Th>
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
                    <Td>
                      {new Date(post?.createdAt).toLocaleString(router.locale)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
      <ModalForm
        isOpen={isOpen}
        onClose={onClose}
        initialValue={{ title: "", description: "" }}
        modalTitle={t("addPostForm.title")}
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
        modalTitle={t("updatePostForm.title")}
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
    </>
  );
};

export default Post;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["post", "common"])),
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
